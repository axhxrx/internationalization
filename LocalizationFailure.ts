import type { LocalizedUnit } from './LocalizedUnit.ts';

/**
 In the event that localization fails, this type describes the failure.
 */
export type LocalizationFailure<Locales extends string> = {
  locale: string;
  unit: LocalizedUnit<Locales>;
  error: Error;
};
