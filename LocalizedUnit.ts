import type { Any } from './Any.ts';
import type { LocalizedFunctionUnit } from './LocalizedFunctionUnit.ts';
import { isLocalizedFunctionUnit } from './LocalizedFunctionUnit.ts';
import type { IsLocalizedStringUnitType, LocalizedStringUnit } from './LocalizedStringUnit.ts';
import { isLocalizedStringUnit } from './LocalizedStringUnit.ts';

/**
 A flexible localized unit that can contain either strings or functions for each locale.

 This allows mixing simple strings and parameterized functions in the same localization tree.

 Examples:
 ```ts
 // String-based unit
 const greeting: LocalizedUnit<'en' | 'ja'> = {
   en: 'Hello',
   ja: 'こんにちは'
 };

 // Function-based unit with parameters
 const welcome: LocalizedUnit<'en' | 'ja', (name: string) => string> = {
   en: (name) => `Welcome, ${name}!`,
   ja: (name) => `ようこそ、${name}さん！`
 };

 // Mixed unit with both strings and functions
 const mixed = {
   greeting,
   welcome
 } as const;
 ```
 */
export type LocalizedUnit<
  Locales extends string,
  Content extends string | ((...args: Any[]) => string) = string,
  MetadataType = unknown,
> = Content extends (...args: Any[]) => string ? LocalizedFunctionUnit<Locales, Content, MetadataType>
  : LocalizedStringUnit<Locales, MetadataType>;

/**
 Type guard to check if a value is any kind of LocalizedUnit (string or function).
 */
export const isLocalizedUnit = <Locales extends string>(
  value: unknown,
): value is LocalizedUnit<Locales, string | ((...args: Any[]) => string)> =>
{
  return isLocalizedStringUnit<Locales>(value) || isLocalizedFunctionUnit<Locales>(value);
};

/**
 Re-export the string unit type check for convenience and backwards compatibility
 */
export type IsLocalizedUnitType<T, Locales extends string> = IsLocalizedStringUnitType<T, Locales>;

// Re-export specific types for explicit use when needed
export { isLocalizedFunctionUnit, isLocalizedStringUnit, type LocalizedFunctionUnit, type LocalizedStringUnit };
