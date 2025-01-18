import type { LocalizationFailure } from './LocalizationFailure.ts';

/**
 `LocalizationOptions` type enables the caller to specify the locale and translation parameters for a translation operation, or a batch of translation operations.

 Example:
 ```ts
 const greeting = localize(greetingI18nItem, { name: 'Alice' }, 'fr');

 // 'Bonjour Alice'
 ```
 */
export type LocalizationOptions<Locales extends string> = {
  locale?: Locales;

  /**
   Values to be interpolated into the localized message (if any).
   */
  interpolationParameters?: Record<string, unknown>;

  /**
   If `true`, skip interpolation for placeholders like `Hello {{ name }}` and return the localized message as-is. Defaults to `false`.
   */
  skipInterpolation?: boolean;

  /**
   Whether to escape the parameters before interpolating them into the localized string. Defaults to `false`, but should be set to `true` if the parameters contain user-supplied or otherwise untrusted data.
   */
  escapeParameters?: boolean;

  /**
   You can override the app settings for the localization failure handler by providing this function.
   */
  failureHandler?: (error: LocalizationFailure<Locales>) => void;
};
