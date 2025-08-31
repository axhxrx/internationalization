import { expect } from '@std/expect';
import { describe, it } from '@std/testing/bdd';

import type { LocalizedStringUnit } from './LocalizedStringUnit.ts';

type SupportedLocales = 'de' | 'en' | 'ja';

// The expected usage is that each app or library defines its own supported locales, and a base type that is "an item localized into the languages of the supported locales". So this just simulates that for this test.
type Localization = LocalizedStringUnit<SupportedLocales>;

describe('I18nItem', () =>
{
  it('should have as-you-type error in TypeScript when a localization is missing', () =>
  {
    const good: Localization = {
      de: 'Roboter',
      en: 'robot',
      ja: 'ロボット',
    };

    // @ts-expect-error Type '{ en: string; }' is missing the following properties from type 'Readonly<Record<SupportedLocales, string>>': de, ja
    const _bad: Localization = {
      en:
        'Whoops, this item is missing a localization for "de" and "ja" so it should be an error in the editor, and the build should fail.',
    };

    expect(good.en).toEqual('robot');
  });

  it('should have as-you-type error in TypeScript when an illegal locale is used', () =>
  {
    // @ts-expect-error Type '{ de: string; en: string; ja: string; _metadata: string; }' is not assignable to type 'never'
    const _bad: LocalizedUnit<'de' | 'en' | 'ja' | '_metadata'> = {
      de: 'Roboter',
      en: 'robot',
      ja: 'ロボット',
      _metadata:
        'This should be an error in the editor, and the build should fail. The `_metadata` key is allowed as a locale because it has special meaning internally.',
    };
  });
});
