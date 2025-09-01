import type { Any } from "./Any.ts";
import type { LocalizationOptionsExcludingInterpolation } from "./LocalizationOptions.ts";
import { localize } from "./localize.ts";
import { isLocalizedFunctionUnit } from "./LocalizedFunctionUnit.ts";
import { isLocalizedUnit } from "./LocalizedUnit.ts";

/**
 Type that transforms a localization tree to preserve function signatures at leaf nodes.

 This allows the resulting tree to have either strings or strongly-typed functions as its leaf nodes.
 */
type LocalizedTreeWithFunctions<T, Locales extends string> = T extends {
  [K in Locales]: infer Content;
}
  ? Content extends (...args: Any[]) => unknown
    ? Content // Preserve the function signature
    : unknown
  : T extends Record<string, Any>
    ? {
        readonly [K in keyof T]: LocalizedTreeWithFunctions<T[K], Locales>;
      }
    : never;

/**
 Localize all values in a tree structure, supporting both simple strings and parameterized functions.

 This allows you to define translations like:
 ```ts
 const translations = {
   button: {
     delete: {
       en: (name: string) => `Delete ${name}`,
       ja: (name: string) => `${name}を削除`
     }
   },
   greeting: {
     en: 'Hello',
     ja: 'こんにちは'
   }
 }
 ```

 And use them with full type safety:
 ```ts
 const t = localizeAllWithFunctions(translations);
 t.button.delete('Document'); // Returns "Delete Document" or "Documentを削除"
 t.greeting; // Returns "Hello" or "こんにちは"
 ```
 */
export const localizeAll = <
  Locales extends string,
  InputT extends Record<string, unknown>,
>(
  localizations: InputT,
  options: LocalizationOptionsExcludingInterpolation<Locales> = {},
): LocalizedTreeWithFunctions<InputT, Locales> => {
  const result: Any = {};

  for (const [key, value] of Object.entries(localizations)) {
    if (isLocalizedUnit(value)) {
      // String-based localized unit - return the localized string
      Object.defineProperty(result, key, {
        get: () => localize(value, { ...options, skipInterpolation: true }),
        enumerable: true,
      });
    } else if (isLocalizedFunctionUnit(value)) {
      // Function-based localized unit - return a function that localizes
      result[key] = (...args: Any[]) => {
        const localeFn = value[options.locale || "en"] as (
          ...args: Any[]
        ) => string;
        return localeFn(...args);
      };
    } else if (typeof value === "object" && value !== null) {
      // Nested object - recurse
      result[key] = localizeAll(value as Record<string, unknown>, options);
    }
  }

  return result;
};
