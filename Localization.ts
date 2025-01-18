import type { LocalizedUnit } from './LocalizedUnit.ts';

/**
 A type for a set of localized values. The structure may be nested, e.g.:
 ```ts
 {
   button: {
     delete: {
       en: 'Delete',
       ja: '削除' }
   }
 }
```

 This is the TypeScript structure that defines the localizations (translations) for a set of values.

 It is the source of truth for the localization system. The object structure is important; from it, key paths like `button.delete` are derived.

 The structure may be arbitrarily nested, but every leaf node is a `LocalizedUnit`. The supported locales are defined by the type parameter `Locales`, and the leaf nodes must use the same locales. The TypeScript type system is leveraged to produce errors when a locale is missing.
 */
export type Localization<Locales extends string> = {
  [key: string]: Localization<Locales> | LocalizedUnit<Locales>;
};
