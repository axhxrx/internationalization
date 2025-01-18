import { expect } from '@std/expect';
import { describe, it } from '@std/testing/bdd';
import { localizeAll } from './localizeAll.ts';

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

describe('localizeAll', () =>
{
  it('should return the i18n object for the given mode', () =>
  {
    const i18n = localizeAll(input1);
    expect(typeof i18n.button.delete).toBe('string');

    const len = i18n.button.delete.length; // autocompletes
    expect(len).toBeGreaterThan(0);
    // @ts-expect-error: error TS2339: Property 'keys' does not exist on type 'string'.
    i18n.button.delete.keys;
  });

  it('return the i18n object messages with placeholders without processing it', () =>
  {
    const i18n = localizeAll(input1);
    expect(i18n.greeting).toMatch(/{{\s*name\s*}}/);
  });
});
