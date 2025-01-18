import type { IsLocalizedUnitType } from './LocalizedUnit.ts';

/**
 This is a magical type that allows us to tell TypeScript "this is a tree structure whose leaf nodes are strings, which has the exact same tree structure as the object `T`".

 This is intended to be used when we have a const object of type `Localization<Locales>`, and we want to map its structure to change the type of its leaf nodes to strings.

 E.g., if we want to winnow a tree structure that contains translations for many locale into a tree structure where the leaf nodes are just the translations for a single locale.

 By using this type, we are able to describe to TypeScript the exact structure of the tree, and do so in a way that TypeScript can understand and enforce with as-you-type auto-completion and errors.
 */
// dprint-ignore
export type TreeOfStringValues<T, Locales extends string> = {
  readonly [K in keyof T]: IsLocalizedUnitType<T[K], Locales> extends true
    ? T[K][keyof T[K]]
    : TreeOfStringValues<T[K], Locales>;
};
