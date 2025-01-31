/**
 Runtime check to determine if a value looks like a `Localization`, and (optionally) matches a reference `Localization` or set of string locales (e.g. `['en', 'ja']`).

 Note: This is a runtime-only check that verifies if an object has the expected Localization structure. We can't actually check this at compile time because we can't know the generic `Locales` type parameter.

 This function checks if:
 1. The value is a non-null object
 2. All leaf nodes are objects with string values (except `_metadata`)
 3. All leaf nodes have the same set of locale keys
 4. If matchingLocales is provided, the set of locales matches that

 @param value The value to check

 @param matchingLocales Optional reference object to compare locale sets against — can be another `Localization` that you know has a specific set of `Locales` or just an array of `string` locales (e.g. `['en', 'ja']`).

 @returns True if the value appears to have a valid Localization structure, and matches the reference if provided
 */
export const isLocalization = (
  value: unknown,
  matchingLocales?: Record<string, unknown> | string[],
): boolean =>
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
    if (!obj || typeof obj !== 'object') return false;

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
    if (!node || typeof node !== 'object') return false;

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
        if (!validateNode(value)) return false;
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
    else
    {
      // Case 2: matchingLocales is another Localization
      if (!isLocalization(matchingLocales))
      {
        return false;
      }

      firstLocaleSet = findFirstUnit(matchingLocales);
      if (!firstLocaleSet)
      {
        // The reference object had no LocalizedUnits
        return false;
      }
    }
  }

  return validateNode(value);
};
