import { escapeHTML } from './escapeHTML.ts';
import type { LocalizationFailure } from './LocalizationFailure.ts';
import type { LocalizedUnit } from './LocalizedUnit.ts';

/**
 Function to interpolate messages

 example
 ```ts
 interpolate("hello {{ target }}", { target: "world" }); // returns "hello world"
 ```

 @param originalText
 @param parameters
 @param escapeParameters whether to escape unsafe HTML characters in the parameter values (default: true)
 */
export const interpolate = <Locales extends string>(
  originalText: string | undefined | null,
  unit: LocalizedUnit<Locales>,
  locale: string,
  parameters?: Record<string, unknown>,
  escapeParameters = true,
  localizationFailureHandlerOverride?: (failure: LocalizationFailure<Locales>) => void,
): string =>
{
  originalText = originalText ?? '';
  const escape = escapeParameters ? escapeHTML : (s: string) => s;

  // Match placeholders of format {{ paramName }} where:
  // - {{ and }} are literal curly braces
  // - \s* matches optional whitespace
  // - (\w+) captures one or more word characters (letters, numbers, or underscore)
  const regexp = /{{\s*(\w+)\s*}}/g;
  let result = originalText;

  for (const match of originalText.matchAll(regexp))
  {
    const paramValue = parameters?.[match[1]];

    if (paramValue === null || paramValue === undefined)
    {
      // If we don't have a value for the placeholder, we should log a failure. By default we will log an error and continue, but the consuming code can change that
      const failure: LocalizationFailure<Locales> = {
        locale,
        unit,
        error: new Error('interpolation parameter not found'),
      };
      if (localizationFailureHandlerOverride)
      {
        localizationFailureHandlerOverride(failure);
      }
      else
      {
        // FIXME: invoke the failure handler here
        console.error('localization failure', failure);
      }
    }
    result = result.replace(match[0], escape(String(paramValue ?? '')));
  }
  return result;
};
