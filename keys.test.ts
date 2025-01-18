import { expect } from '@std/expect';
import { describe, it } from '@std/testing/bdd';
import { keys } from './keys.ts';

const input1 = {
  button: {
    delete: {
      en: 'Delete',
      ja: '削除',
    },
  },
  greeting: {
    en: 'Hello {{ name }}', // with spaces
    ja: 'こんにちは  {{name}}', // no spaces
  },
} as const;

describe('keys', () =>
{
  it('should return the key path tree object for the given object', () =>
  {
    const keyPaths = keys(input1);
    expect(typeof keyPaths.button.delete).toBe('string');
    expect(keyPaths.button.delete).toBe('button.delete');
    expect(keyPaths.greeting).toBe('greeting');

    const len = keyPaths.button.delete.length; // autocompletes
    expect(len).toBeGreaterThan(0);
    // @ts-expect-error: error TS2339: Property 'keys' does not exist on type 'string'.
    keyPaths.button.delete.keys;
  });
});
