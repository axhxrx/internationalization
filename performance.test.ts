import { expect } from '@std/expect';
import { describe, it } from '@std/testing/bdd';

/**
 Runs the following command:

 ```shell
 export TS_FILE=performance.fixture.ts # or whatever...

 npx -y --package typescript tsc --strict true --target esnext $TS_FILE --allowImportingTsExtensions --noEmit --extendedDiagnostics
 ```
 */
async function runTsc(tsFile: string)
{
  const tscCommand = new Deno.Command('npx', {
    args: [
      '-y',
      '--package',
      'typescript',
      'tsc',
      '--strict',
      'true',
      '--target',
      'esnext',
      tsFile,
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
  const stderrString = new TextDecoder().decode(stderr);

  if (code !== 0)
  {
    console.error('tsc exited with a non-zero exit code', code, stderrString);
  }
  expect(code, 'tsc exited with a non-zero exit code').toBe(0);
  expect(stdoutString, 'tsc produced no output').not.toBe('');

  const checkTimeLine = stdoutString
    .split('\n')
    .find(line => line.includes('Check time'));

  const match = checkTimeLine!.match(/([\d.]+)s/);
  expect(match, 'tsc produced a valid check time line').not.toBe(null);
  const checkTime = parseFloat(match![1]);

  return { code, stdout: stdoutString, stderr: stderrString, elapsedMs, checkTime };
}

describe('TypeScript type-checking performance of tsc with a large Localization and related types', () =>
{
  it('should be fast', async () =>
  {
    const largeFile = await runTsc('performance.fixture.ts');
    const simpleFile = await runTsc('escapeHTML.ts');

    console.log(`checkTime: ${largeFile.checkTime}ms vs ${simpleFile.checkTime}s`);

    console.log(largeFile);
    console.log(simpleFile);

    expect(largeFile.code).toBe(0);
    expect(largeFile.stdout).not.toBe('');

    expect(simpleFile.code).toBe(0);
    expect(simpleFile.stdout).not.toBe('');

    expect(largeFile.checkTime).toBeGreaterThan(0);
    expect(simpleFile.checkTime).toBeGreaterThan(0);

    // I had to bump this above 1.0 because GitHub Actions CI filesystem is so slow that the "I/O Read time" is sometimes over 0.5s (vs 0.02s on a normal computer).
    expect(largeFile.checkTime).toBeLessThan(1.25);

    expect(simpleFile.checkTime).toBeLessThan(1);

    expect(largeFile.checkTime).toBeLessThan(simpleFile.checkTime * 1.5);

    // This 'total elapsed time' thing doesn't work on GitHub Actions CI, because the "I/O Read time" and apparently the "spawn process" latency is super huge and causes widely-variable results.
    // expect(largeFile.elapsedMs).toBeGreaterThan(0);
    // expect(largeFile.elapsedMs).toBeLessThan(simpleFile.elapsedMs * 1.5);
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
