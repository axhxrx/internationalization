import type { LocalizedStringUnit } from './LocalizedStringUnit.ts';

/**
 In the event that localization fails, this type describes the failure.
 */
export type LocalizationFailure<Locales extends string> = {
  locale: string;
  unit: LocalizedStringUnit<Locales>;
  error: Error;
};
