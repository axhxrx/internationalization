import type { Localization } from './Localization.ts';

import { isLocalizedUnit, type IsLocalizedUnitType } from './LocalizedUnit.ts';
import type { TreeOfStringValues } from './TreeOfStringValues.ts';

type KeyPathTree<T, Locales extends string> = TreeOfStringValues<T, Locales>;

/**
 The `Keys` type is intended to represent a tree structure whose leaf nodes are strings which are just key paths to themselves, which has the exact same tree structure as the object `T`. This can be used to make using `Localization` objects more ergonomic.
 */
// dprint-ignore
type Keys<T, Locales extends string> = {
  readonly [K in keyof T]: IsLocalizedUnitType<T[K], Locales> extends true
    ? string
    : KeyPathTree<T[K], Locales>;
};

/**
 Takes an input object like `{ button: { delete: { en: 'Delete', ja: '削除' } } }` and returns a result like `{ button: { delete: 'button.delete' } }`.

 This is mainly used to make using `Localization` objects more ergonomic.
 */
export const keys = <
  Locales extends string,
  InputT extends Record<string, unknown> = Localization<Locales>,
>(
  localization: InputT,
  startingKeyPath = '',
): Keys<InputT, Locales> =>
{
  const result: Keys<InputT, Locales> = {} as Keys<InputT, Locales>;
  for (const [key, value] of Object.entries(localization))
  {
    if (isLocalizedUnit(value))
    {
      // This is a leaf node, make its value the key path to itself
      Object.defineProperty(result, key, {
        get: () => startingKeyPath ? `${startingKeyPath}.${key}` : key,
        enumerable: true,
      });
    }
    else
    {
      // This is a nested object (Localization), but we have to do just a little tiny bit of evil here to make TypeScript happy. This is because we must return `LocalizedValues<InputT>` from  this method in order to get bulletproof const typing.
      const unsafeMutableResult = result as Record<string, unknown>;

      unsafeMutableResult[key] = keys(
        value as Keys<InputT, Locales>,
        startingKeyPath ? `${startingKeyPath}.${key}` : key,
      );
    }
  }
  return result;
};
