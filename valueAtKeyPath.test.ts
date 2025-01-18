import { expect } from '@std/expect';
import { describe, it } from '@std/testing/bdd';
import { localizeAll } from './localizeAll.ts';
import { valueAtKeyPath } from './valueAtKeyPath.ts';

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

describe('valueAtKeyPath', () =>
{
  it('should return the value at the given key path for Localization', () =>
  {
    const value = valueAtKeyPath(input1, 'button.delete.en');
    expect(value).toBe('Delete');
    const value2 = valueAtKeyPath(input1, 'button.delete.ja');
    expect(value2).toBe('削除');

    const partialKeyPathValue = valueAtKeyPath(input1, 'greeting');
    const en = partialKeyPathValue.en;
    expect(en).toBe('Hello {{ name }}');
    const ja = partialKeyPathValue.ja;
    expect(ja).toBe('こんにちは  {{name}}');

    const partialKeyPathValue2 = valueAtKeyPath(input1, 'button.delete');
    const en2 = partialKeyPathValue2.en;
    expect(en2).toBe('Delete');
    const ja2 = partialKeyPathValue2.ja;
    expect(ja2).toBe('削除');
  });

  it('should return the value at the given key path for single-locale trees', () =>
  {
    const en = localizeAll(input1, { locale: 'en' });
    const ja = localizeAll(input1, { locale: 'ja' });

    const value = valueAtKeyPath(en, 'greeting');
    expect(value).toBe('Hello {{ name }}');
    const value2 = valueAtKeyPath(ja, 'greeting');
    expect(value2).toBe('こんにちは  {{name}}');
  });

  it('should return undefined if the key path does not exist', () =>
  {
    const value = valueAtKeyPath(input1, 'button.delete.no');
    expect(value).toBeUndefined();
  });
});
