import { expect } from '@std/expect';
import { describe, it } from '@std/testing/bdd';
import { localize } from './localize.ts';
import type { LocalizedUnit } from './LocalizedUnit.ts';

describe('localize()', () =>
{
  const mockI18nItem: LocalizedUnit<'en' | 'ja'> = {
    en: 'Hello {{name}}',
    ja: 'こんにちは {{name}}',
  };

  it('should basically work', () =>
  {
    const actual = localize(mockI18nItem, { locale: 'en', interpolationParameters: { name: 'Alice' } });
    expect(actual).toEqual('Hello Alice');

    const actual2 = localize(mockI18nItem, { locale: 'ja', interpolationParameters: { name: 'Alice' } });
    expect(actual2).toEqual('こんにちは Alice');
  });
});
