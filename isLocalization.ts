import type { Localization } from './Localization.ts';

/**
 Type helper that extracts the `Locales` types from different types of source object (either a `Localization<Locales>` or an array of `string` locales).

 This is a lot of type fuckery and looks like 🤖🤮 but OTOH it is very convenient to be able to narrow the type of an unknown value (e.g. something coming from JSON) to get a `Localization` matching a known set of `Locales`.
 */
// dprint-ignore
export type InferLocalizationType<
  DefaultLocalesT extends string,
  MatchingLocalesRefT,
  > = MatchingLocalesRefT extends readonly (infer ExtractedLocalesT extends string)[]
    ? Localization<ExtractedLocalesT>
    : MatchingLocalesRefT extends Localization<infer ExtractedLocalesT>
      ? Localization<ExtractedLocalesT>
      : Localization<DefaultLocalesT>;

/**
 Type guard with a runtime check to determine if a value looks like a `Localization` (that is, is a valid `Localization<string>`), and (optionally) allows passing an array of your actual `Locales` so that you can check if the object is a `Localization` with a specific `Locales` type, such as `Locale<'en' | 'fr'>`).

 This function checks if:
 1. The value is a non-null object
 2. All leaf nodes are objects with string values (except `_metadata`)
 3. All leaf nodes have the same set of locale keys
 4. If matchingLocales is provided, the set of locales matches that

 @param value The value to check

 @param matchingLocales Optional reference object to compare locale sets against — can be another `Localization` that you know has a specific set of `Locales` or just an array of `string` locales (e.g. `['en', 'ja']`).

 @returns `true` (and causes TypeScript to narrow the type) if the value appears to have a valid Localization structure, and matches the reference if provided, otherwise `false`.
 */
export function isLocalization<
  DefaultLocalesT extends string = string,
  MatchingLocalesRefT = undefined,
>(
  value: unknown,
  matchingLocales?: MatchingLocalesRefT,
): value is InferLocalizationType<DefaultLocalesT, MatchingLocalesRefT>
{
  if (!value || typeof value !== 'object')
  {
    return false;
  }

  // Store the first set of locales we find to compare against
  let firstLocaleSet: Set<string> | null = null;

  // Helper to check if an object looks like a LocalizedUnit
  const isLocalizedUnitLike = (obj: unknown): boolean =>
  {
    if (!obj || typeof obj !== 'object')
    {
      return false;
    }

    const locales = Object.keys(obj).filter(key => key !== '_metadata');
    if (locales.length === 0)
    {
      return false;
    }

    // Check all values are strings
    for (const locale of locales)
    {
      if (typeof (obj as Record<string, unknown>)[locale] !== 'string')
      {
        return false;
      }
    }

    // If this is our first LocalizedUnit and we don't have a reference set, store its locales
    if (!firstLocaleSet)
    {
      firstLocaleSet = new Set(locales);
      return true;
    }

    // Otherwise, compare against the first set we found
    const currentSet = new Set(locales);
    if (currentSet.size !== firstLocaleSet.size) return false;
    return [...currentSet].every(locale => firstLocaleSet!.has(locale));
  };

  // Helper to recursively validate the structure
  const validateNode = (node: unknown): boolean =>
  {
    if (!node || typeof node !== 'object')
    {
      return false;
    }

    // Check each property
    for (const [key, value] of Object.entries(node))
    {
      if (key === '_metadata')
      {
        continue;
      }

      if (isLocalizedUnitLike(value))
      {
        // This is a leaf node (LocalizedUnit)
        continue;
      }
      else if (typeof value === 'object' && value !== null)
      {
        // This is an intermediate node (Localization)
        if (!validateNode(value))
        {
          console.error(`Invalid node: ${JSON.stringify(value)}`);
          return false;
        }
      }
      else
      {
        // Invalid node type
        return false;
      }
    }

    return true;
  };

  // Helper to find the first LocalizedUnit in the reference to get its locales
  const findFirstUnit = (obj: unknown): Set<string> | null =>
  {
    if (!obj || typeof obj !== 'object') return null;

    for (const [key, val] of Object.entries(obj))
    {
      if (key === '_metadata') continue;

      if (isLocalizedUnitLike(val))
      {
        return new Set(Object.keys(val).filter(k => k !== '_metadata'));
      }
      else if (typeof val === 'object' && val !== null)
      {
        const result = findFirstUnit(val);
        if (result) return result;
      }
    }
    return null;
  };

  // If we have matching locales, validate against them
  if (matchingLocales !== undefined)
  {
    if (Array.isArray(matchingLocales))
    {
      // Case 1: matchingLocales is a string array
      if (!matchingLocales.every(locale => typeof locale === 'string'))
      {
        return false;
      }
      firstLocaleSet = new Set(matchingLocales);
    }
    else if (typeof matchingLocales === 'object' && matchingLocales !== null)
    {
      // Case 2: matchingLocales is another Localization-like object
      // Look for the first LocalizedUnit-like object to get its locales
      firstLocaleSet = findFirstUnit(matchingLocales);
      if (!firstLocaleSet)
      {
        // The reference object had no LocalizedUnits
        return false;
      }
    }
    else
    {
      // Invalid matchingLocales type
      return false;
    }
  }

  return validateNode(value);
}
