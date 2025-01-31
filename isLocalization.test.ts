import { expect } from '@std/expect';
import { describe, it } from '@std/testing/bdd';
import { isLocalization } from './isLocalization.ts';

describe('isLocalization', () =>
{
  it('should return true for a valid Localization', () =>
  {
    expect(isLocalization({ foo: { en: 'Hello' } })).toBe(true);
    expect(isLocalization(fruits)).toBe(true);
    expect(isLocalization(vegetables)).toBe(true);
    expect(isLocalization(breads)).toBe(true);
  });

  it('should return false for an invalid Localization', () =>
  {
    expect(isLocalization('Hello')).toBe(false);
    expect(isLocalization(invalidBreads)).toBe(false);
  });

  describe('with matchingLocales parameter', () =>
  {
    it('should validate against another Localization', () =>
    {
      // Same locale set (en, ja)
      expect(isLocalization(fruits, vegetables)).toBe(true);
      expect(isLocalization(vegetables, fruits)).toBe(true);

      // Different locale set (en, de)
      expect(isLocalization(breads, fruits)).toBe(false);
      expect(isLocalization(fruits, breads)).toBe(false);
    });

    it('should validate against string array of locales', () =>
    {
      expect(isLocalization(fruits, ['en', 'ja'])).toBe(true);
      expect(isLocalization(vegetables, ['en', 'ja'])).toBe(true);
      expect(isLocalization(breads, ['en', 'de'])).toBe(true);

      // Wrong locales
      expect(isLocalization(fruits, ['en', 'de'])).toBe(false);
      expect(isLocalization(breads, ['en', 'ja'])).toBe(false);
    });

    it('should handle invalid matching locales', () =>
    {
      // @ts-expect-error Type 'number' is not assignable to type 'string'
      expect(isLocalization(fruits, ['not', 123])).toBe(false);
      expect(isLocalization(fruits, {})).toBe(false);
    });
  });
});

describe('isLocalization edge cases', () =>
{
  it('returns false for invalid leaf nodes', () =>
  {
    expect(isLocalization({
      button: {
        delete: {
          en: 123, // Not a string
          ja: '削除',
        },
      },
    })).toBe(false);
  });

  it('returns false for inconsistent locale sets', () =>
  {
    expect(isLocalization({
      button: {
        delete: {
          en: 'Delete',
          ja: '削除',
        },
        save: {
          en: 'Save',
          fr: 'Sauvegarder', // Different locale
        },
      },
    })).toBe(false);
  });

  it('handles _metadata correctly', () =>
  {
    expect(isLocalization({
      button: {
        delete: {
          en: 'Delete',
          ja: '削除',
          _metadata: { timestamp: '2025-01-31' },
        },
      },
      _metadata: { version: '1.0.0' },
    })).toBe(true);
  });
});

const fruits = {
  apple: {
    en: 'apple',
    ja: 'りんご',
  },
  pomegranate: {
    en: 'pomegranate',
    ja: 'ザクロ',
  },
} as const;

const vegetables = {
  carrot: {
    en: 'carrot',
    ja: '人参',
  },
  cucumber: {
    en: 'cucumber',
    ja: 'キュウリ',
  },
} as const;

const breads = {
  rye: {
    en: 'rye',
    de: 'Weizen',
  },
  pretzel: {
    en: 'pretzel',
    de: 'Pretzel',
  },
} as const;

const invalidBreads = {
  rye: {
    en: 'rye',
    ja: 'Weizen',
  },
  pretzel: {
    en: 'pretzel',
    de: 'Pretzel',
  },
} as const;
