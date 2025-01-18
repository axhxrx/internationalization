import { getCurrentLocale } from './CurrentLocale.ts';
import { interpolate } from './interpolate.ts';
import type { LocalizationFailure } from './LocalizationFailure.ts';
import type { LocalizationOptions } from './LocalizationOptions.ts';
import type { LocalizedUnit } from './LocalizedUnit.ts';

/**
 The `localize()` function returns the localized string for the given `msg` and `param` in the current locale. The 'current locale' is determined by the `getCurrentLocale()` function, whose implementation depends on the configuration that the consuming app must provide, unless the default implementation is sufficient.

 This function has to be generic to make the end-to-end static typing work.
 */
export const localize = <Locales extends string>(
  unit: LocalizedUnit<Locales>,
  options: LocalizationOptions<Locales> = {},
): string =>
{
  const { locale, interpolationParameters, escapeParameters, skipInterpolation } = options;

  const resolvedLocale = locale ?? getCurrentLocale(unit);

  const localizedValue = unit[resolvedLocale];

  if (localizedValue === undefined || localizedValue === null)
  {
    const failure: LocalizationFailure<Locales> = {
      locale: resolvedLocale,
      unit: unit,
      error: new Error('localized value not found'),
    };
    if (options.failureHandler)
    {
      options.failureHandler(failure);
    }
    else
    {
      // FIXME: invoke the failure handler here
      console.error('localization failure', failure);
    }
    return '[error: localized value not found]';
  }

  if (skipInterpolation)
  {
    return localizedValue;
  }

  return interpolate<Locales>(
    localizedValue,
    unit,
    resolvedLocale,
    interpolationParameters,
    escapeParameters ?? true,
    options.failureHandler,
  );
};
