export * from './CurrentLocale.ts';
export * from './escapeHTML.ts';
export * from './interpolate.ts';
export * from './keys.ts';
export * from './Localization.ts';
export * from './LocalizationFailure.ts';
export * from './LocalizationOptions.ts';
export * from './localize.ts';
export * from './localizeAll.ts';
export * from './LocalizedUnit.ts';
export * from './TreeOfStringValues.ts';
export * from './valueAtKeyPath.ts';

import { main } from './main.ts';

if (import.meta.main)
{
  main();
}
