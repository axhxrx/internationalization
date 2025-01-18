import { expect } from '@std/expect';
import { describe, it } from '@std/testing/bdd';

async function runTsc(file: string)
{
  const tscCommand = new Deno.Command('npx', {
    args: [
      'tsc',
      '--strict',
      'true',
      '--target',
      'esnext',
      file,
      '--allowImportingTsExtensions',
      '--noEmit',
      '--extendedDiagnostics',
    ],
  });

  const start = performance.now();
  const { code, stdout, stderr } = await tscCommand.output();
  const end = performance.now();
  const elapsedMs = end - start;

  const stdoutString = new TextDecoder().decode(stdout);

  expect(code, 'tsc exited with a non-zero exit code').toBe(0);
  expect(stdoutString, 'tsc produced no output').not.toBe('');

  const checkTimeLine = stdoutString
    .split('\n')
    .find(line => line.includes('Check time'));

  const match = checkTimeLine!.match(/([\d.]+)s/);
  expect(match, 'tsc produced a valid check time line').not.toBe(null);
  const checkTime = parseFloat(match![1]);

  return { code, stdout, stderr, elapsedMs, checkTime };
}

describe('TypeScript type-checking performance of tsc with a large Localization and related types', () =>
{
  it('should be fast', async () =>
  {
    const largeFile = await runTsc('performance.fixture.ts');
    const simpleFile = await runTsc('escapeHTML.ts');

    expect(largeFile.code).toBe(0);
    expect(largeFile.stdout).not.toBe('');

    expect(simpleFile.code).toBe(0);
    expect(simpleFile.stdout).not.toBe('');

    expect(largeFile.checkTime).toBeGreaterThan(0);
    expect(simpleFile.checkTime).toBeGreaterThan(0);

    expect(largeFile.checkTime).toBeLessThan(1);
    expect(simpleFile.checkTime).toBeLessThan(1);

    expect(largeFile.elapsedMs).toBeLessThan(simpleFile.elapsedMs * 1.5);
    expect(largeFile.checkTime).toBeLessThan(simpleFile.checkTime * 1.5);

    console.log(`checkTime: ${largeFile.checkTime}ms vs ${simpleFile.checkTime}ms`);
  });
});

/*
NOTES

npx tsc --strict true --target esnext performance.fixture.ts --allowImportingTsExtensions --noEmit --extendedDiagnostics
Files:                         96
Lines of Library:           42452
Lines of Definitions:           0
Lines of TypeScript:         8913
Lines of JavaScript:            0
Lines of JSON:                  0
Lines of Other:                 0
Identifiers:                54021
Symbols:                    55673
Types:                      21491
Instantiations:             11958
Memory used:               96147K
Assignability cache size:    5547
Identity cache size:           15
Subtype cache size:            24
Strict subtype cache size:     18
I/O Read time:              0.02s
Parse time:                 0.11s
ResolveModule time:         0.00s
ResolveLibrary time:        0.01s
Program time:               0.16s
Bind time:                  0.05s
Check time:                 0.36s
printTime time:             0.00s
Emit time:                  0.00s
Total time:                 0.57s
*/
