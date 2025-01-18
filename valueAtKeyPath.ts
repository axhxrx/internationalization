type PathValue<T, P extends string> = P extends `${infer K}.${infer R}`
  ? K extends keyof T
    ? PathValue<T[K], R>
    : never
  : P extends keyof T
    ? T[P]
    : never;

/**
 Retrieves a value from a nested object structure using a dot-separated key path.

 Example:
 ```ts
 const obj = { user: { name: { first: 'John' } } };
 valueAtKeyPath(obj, 'user.name.first'); // returns 'John'
 valueAtKeyPath(obj, 'user.name.middle'); // returns undefined

 const x = valueAtKeyPath(obj, 'user.name.middle');
 // type of x is `never` because the key path is invalid
 ```

 @param tree The object to traverse
 @param keyPath Dot-separated path to the desired value (e.g. 'user.name.first')
 @throws {Error} If the key path is empty or if any part of the path is invalid
 */
export const valueAtKeyPath = <
  T extends Record<string, unknown>,
  P extends string
>(
  tree: T,
  keyPath: P
): PathValue<T, P> => {
  if (!keyPath) {
    throw new Error('valueAtKeyPath(): Key path cannot be empty');
  }

  return keyPath.split('.').reduce<unknown>((obj, key) => {
    if (obj === null || obj === undefined || typeof obj !== 'object') {
      throw new Error(`Invalid path: ${keyPath}`);
    }
    return (obj as Record<string, unknown>)[key];
  }, tree) as PathValue<T, P>;
};