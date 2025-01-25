/**
 A "localized item" type, which defines the shape of a piece of text content that has been translated into multiple languages, which are defined by the generic type parameter `Locales`.

 The expected usage of this type is that each app or library defines its own supported locales, and a base type that is "an item localized into the languages of the supported locales". Example:

 ```ts
 // Suppose we work for ACME Corp., and our markets are USA, Germany, and Japan:
 export type AcmeLocales = 'de' | 'en' | 'ja';

 // Note that you can use `'en_US'` / `'en_GB'` style locales if you wish; this lib doesn't care exactly how locales are defined, so long as they are unique strings.

 export type AcmeLocalizedUnit = LocalizedUnit<AcmeLocales>;
 export type AcmeLocalization = Localization<AcmeLocales>;
 ```

 These base types aren't directly used much, but they are **adhered to**, and type-checked. Normally, each localization is expected to look something like this:

 ```ts
 // e.g. in the file `FooComponent.localization.ts`:
 export const localizations = {
  avatar {
    robot:
      de: 'Roboter',
      en: 'robot',
      ja: 'ロボット',
    },
    werewolf: {
      de: 'Werwolf',
      en: 'werewolf',
      ja: '狼人',
    },
    //...
  }
 } as const;
 ```

 It is possible to just have one file with all of an app's localizations in it, but having the localizations literally implemented in TypeScript enables a couple of usually-better approaches:

 1. Localizations that are specific to a single component or page can be defined in a file that is specific to that component or page, and imported and used directly in the component or page.

 2. Common/shared localizations can be defined in a single file, and then imported and combined in a new file that adds just the unique localizations for the current page or component. E.g.:

 ```ts
 // `FooComponent.localization.ts`:

 import { common, button, label } from './common/localizations.ts';

 export const localizations = {
  common,
  button,
  label,
  avatar {
    robot:
      de: 'Roboter',
      en: 'robot',
      ja: 'ロボット',
    },
    werewolf: {
      de: 'Werwolf',
      en: 'werewolf',
      ja: '狼人',
    },
    //...
  }
 } as const;
 ```

 (How finely-grained localizations are exported, and the naming conventions used, are details left up to the developer.)

 ### Metadata

 To facilitate integration with other localization systems (e.g. legaprise stuff, external systems managed by localization vendors, etc), there is a special reserved key `'_metadata'`, which is used to store arbitrary metadata about the item. By default this is not used, but it is available if needed. This can be used to store things like "This localization was created on 2025-01-13 by ChatGPT o1-mini version 1.0.0", or "This localization was reviewed and approved by Jane Doe on 2025-01-13", and so on.

 This library doesn't itself populate or use this metadata.
 */
export type LocalizedUnit<Locales extends string, MetadataType = unknown> = '_metadata' extends Locales ? never
  : Readonly<{
    [K in Locales]: string;
  }> & {
    readonly _metadata?: MetadataType;
  };

export type LocalizedUnitOff<Locales extends string> = Readonly<
  Record<Locales, string>
>;

/**
 Intermediate type used only for conditional type checking in `LocalizedValues<T>`
 */
export type IsLocalizedUnitType<T, Locales extends string> = T extends { [K in Locales]: string } ? true : false;

/**
 Type guard to check if a value is a `LocalizedUnit`.
 */
export const isLocalizedUnit = <Locales extends string>(
  value: unknown,
): value is LocalizedUnit<Locales> =>
{
  if (!value)
  {
    return false;
  }
  if (typeof value !== 'object')
  {
    return false;
  }
  // We'd like to do this, but we cannot know here what the actual set of locales is:
  //
  // if (!('en' in value) || !('ja' in value)) {
  //   return false;
  // }
  // if (typeof value.en !== 'string' || typeof value.ja !== 'string') {
  //   return false;
  // }
  //
  // So we have to do this instead:
  const locales = Object.keys(value);
  if (locales.length === 0)
  {
    return false;
  }
  for (const locale of locales)
  {
    const localeValue = (value as Record<string, unknown>)[locale];
    if (typeof localeValue !== 'string')
    {
      return false;
    }
  }
  return true;
};
