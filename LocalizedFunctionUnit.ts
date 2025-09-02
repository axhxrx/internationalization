import type { Any } from './Any.ts';

/**
 A localized function unit that contains functions for each locale instead of strings.
 Each function can have its own strongly-typed parameters.
 */
export type LocalizedFunctionUnit<
  Locales extends string,
  Fn extends (...args: Any[]) => string,
  MetadataType = unknown,
> = '_metadata' extends Locales ? never
  :
    & Readonly<
      {
        [K in Locales]: Fn;
      }
    >
    & {
      readonly _metadata?: MetadataType;
    };

/**
 Type guard to check if a value is a LocalizedFunctionUnit
 */
export const isLocalizedFunctionUnit = <Locales extends string>(
  value: unknown,
): value is LocalizedFunctionUnit<Locales, (...args: Any[]) => string> =>
{
  if (!value || typeof value !== 'object')
  {
    return false;
  }

  const locales = Object.keys(value).filter((key) => key !== '_metadata');
  if (locales.length === 0)
  {
    return false;
  }

  for (const locale of locales)
  {
    const localeValue = (value as Record<string, unknown>)[locale];
    if (typeof localeValue !== 'function')
    {
      return false;
    }
  }
  return true;
};
