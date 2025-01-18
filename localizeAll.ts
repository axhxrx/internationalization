import type { Localization } from './Localization.ts';
import { LocalizationOptions, LocalizationOptionsExcludingInterpolation } from './LocalizationOptions.ts';
import { localize } from './localize.ts';

import { isLocalizedUnit } from './LocalizedUnit.ts';
import type { TreeOfStringValues } from './TreeOfStringValues.ts';

/**
 Type for a tree structure whose leaf nodes are localized string values, which has the exact same tree structure as the object `T`. This is used by `localizeAll()` to convert a multi-locale `Localization` object to a tree with the same structure, but with translations for a single-locale.
 */
type LocalizedTree<T, Locales extends string> = TreeOfStringValues<T, Locales>;

/**
 Takes an input object like `{ button: { delete: { en: 'Delete', ja: '削除' } } }` and returns a result like `{ button: { delete: '削除' } }`.

 That is, it returns a new object with the same structure as the input object, but with all the values replaced by readonly localized string values for the current locale.

 Intended usage is for the app (or component, it needn't be app-level) to define a single object with all the i18n values (perhaps by composing them from smaller pieces using the spread operator), and then pass that object to this function to get a new object with all the values localized.

 NOTE: interpolation for placeholders like `Hello {{ name }}` will not be performed by this function. If you need interpolation, use `interpolate()` directly.

  @param Localizations The object to localize

  @returns A new object with all the values replaced by localized strings
 */
export const localizeAll = <
  Locales extends string,
  InputT extends Record<string, unknown> = Localization<Locales>,
>(
  Localizations: InputT,
  options: LocalizationOptionsExcludingInterpolation<Locales> = {},
): LocalizedTree<InputT, Locales> =>
{
  const result: LocalizedTree<InputT, Locales> = {} as LocalizedTree<
    InputT,
    Locales
  >;
  for (const [key, value] of Object.entries(Localizations))
  {
    if (isLocalizedUnit(value))
    {
      // This is a leaf node (LocalizedUnit)
      Object.defineProperty(result, key, {
        get: () => localize(
          value, { ...options, skipInterpolation: true }),
          enumerable: true,
      });
    }
    else
    {
      // This is a nested object (Localizations), but we have to do just a little tiny bit of evil here to make TypeScript happy. This is because we must return `LocalizedValues<InputT>` from  this method in order to get bulletproof const typing.
      const unsafeMutableResult = result as Record<string, unknown>;

      unsafeMutableResult[key] = localizeAll(
        value as LocalizedTree<InputT, Locales>,
        options,
      );
    }
  }
  return result;
};
