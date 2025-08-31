import type { LocalizedStringUnit } from './LocalizedStringUnit.ts';

/**
  This default implementation may be sufficient for most use cases, but it can be overridden by the consuming app, if necessary.

  FIXME: how?
 */
export const getCurrentLocale = <Locales extends string>(
  localizedUnit: LocalizedStringUnit<Locales>,
): keyof LocalizedStringUnit<Locales> & string =>
{
  const FALLBACK_LOCALE = 'en';

  // Check if we're in a browser environment and can access document properties. If so, use the document's locale as specified in the <html> tag.
  const locale = (typeof globalThis !== 'undefined' && 'document' in globalThis
    // deno-lint-ignore no-explicit-any
    && (globalThis as unknown as { document: any }).document?.documentElement?.lang) || FALLBACK_LOCALE; // 🤖🤮

  if (!localizedUnit)
  {
    return locale as Locales;
  }

  const value = localizedUnit[locale as Locales];

  if (!value)
  {
    // FIXME: invoke the failure handler here

    // Let's try to find a fallback locale. We'll just use the first locale we find in the object
    const firstLocale = Object.keys(localizedUnit)[0];

    if (firstLocale)
    {
      return firstLocale as Locales;
    }
  }
  return locale as Locales;
};
