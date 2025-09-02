import {
  assertEquals,
  assertGreater,
  assertNotEquals,
} from '@std/assert';
import { localizationWithReactElements } from './localizeAll.fixture.tsx';
import { localizeAll } from './localizeAll.ts';

// Define supported locales
type AppLocales = 'en' | 'ja' | 'de';

// Create translations with both simple strings and parameterized functions
const translations = {
  button: {
    // Simple string translation
    cancel: {
      en: 'Cancel',
      ja: 'キャンセル',
      de: 'Abbrechen',
    },
    // Parameterized function with single string parameter
    delete: {
      en: (objectName: string) => `Delete ${objectName}`,
      ja: (objectName: string) => `${objectName}を削除`,
      de: (objectName: string) => `${objectName} löschen`,
    },
    // Function with multiple typed parameters
    confirmDelete: {
      en: (count: number, type: string) => count === 1 ? `Delete ${count} ${type}?` : `Delete ${count} ${type}s?`,
      ja: (count: number, type: string) => `${count}個の${type}を削除しますか？`,
      de: (count: number, type: string) => `${count} ${type} löschen?`,
    },
  },
  message: {
    // Simple greeting
    welcome: {
      en: 'Welcome!',
      ja: 'ようこそ！',
      de: 'Willkommen!',
    },
    // Personalized greeting with name
    hello: {
      en: (name: string) => `Hello, ${name}!`,
      ja: (name: string) => `こんにちは、${name}さん！`,
      de: (name: string) => `Hallo, ${name}!`,
    },
    // Complex function with optional parameters
    itemsFound: {
      en: (count: number, query?: string) =>
        query
          ? `Found ${count} item${count !== 1 ? 's' : ''} matching "${query}"`
          : `Found ${count} item${count !== 1 ? 's' : ''}`,
      ja: (count: number, query?: string) =>
        query ? `"${query}"に一致する${count}件のアイテムが見つかりました` : `${count}件のアイテムが見つかりました`,
      de: (count: number, query?: string) =>
        query
          ? `${count} Element${count !== 1 ? 'e' : ''} gefunden für "${query}"`
          : `${count} Element${count !== 1 ? 'e' : ''} gefunden`,
    },
  },
} as const;

Deno.test('localizeAll - simple strings work as properties', () =>
{
  const t = localizeAll<AppLocales, typeof translations>(translations, {
    locale: 'en',
  });

  assertEquals(t.button.cancel, 'Cancel');
  assertEquals(t.message.welcome, 'Welcome!');

  // Test German locale
  const tDe = localizeAll<AppLocales, typeof translations>(translations, {
    locale: 'de',
  });

  assertEquals(tDe.button.cancel, 'Abbrechen');
  assertEquals(tDe.message.welcome, 'Willkommen!');
});

Deno.test('localizeAll - functions with single parameter', () =>
{
  const t = localizeAll<AppLocales, typeof translations>(translations, {
    locale: 'en',
  });

  assertEquals(
    t.button.delete('Untitled Document'),
    'Delete Untitled Document',
  );
  assertEquals(t.message.hello('Alice'), 'Hello, Alice!');

  // Test Japanese locale
  const tJa = localizeAll<AppLocales, typeof translations>(translations, {
    locale: 'ja',
  });

  assertEquals(tJa.button.delete('ドキュメント'), 'ドキュメントを削除');
  assertEquals(tJa.message.hello('太郎'), 'こんにちは、太郎さん！');
});

Deno.test('localizeAll - functions with multiple parameters', () =>
{
  const t = localizeAll<AppLocales, typeof translations>(translations, {
    locale: 'en',
  });

  assertEquals(t.button.confirmDelete(1, 'file'), 'Delete 1 file?');
  assertEquals(t.button.confirmDelete(5, 'file'), 'Delete 5 files?');
});

Deno.test('localizeAll - functions with optional parameters', () =>
{
  const t = localizeAll<AppLocales, typeof translations>(translations, {
    locale: 'en',
  });

  assertEquals(
    t.message.itemsFound(3, 'typescript'),
    'Found 3 items matching "typescript"',
  );
  assertEquals(t.message.itemsFound(1), 'Found 1 item');
  assertEquals(t.message.itemsFound(0), 'Found 0 items');
});

Deno.test('localizeAll - functions returning React elements', () =>
{
  const t = localizeAll<AppLocales, typeof localizationWithReactElements>(
    localizationWithReactElements,
    { locale: 'en' },
  );

  const element = t.hello('Person 1');
  console.log(element);
  assertNotEquals(element, null);
  console.log(element.props);

  // Test that will fail if string is type `unknown` (which it was in 0.0.12 due to bug)
  const string = t.string;
  const length = string.length;
  assertGreater(length, 7);
});

Deno.test('localizeAll - type checking prevents incorrect usage', () =>
{
  const t = localizeAll<AppLocales, typeof translations>(translations, {
    locale: 'en',
  });

  // These should all cause TypeScript errors at compile time.
  // We wrap them in functions that never get called to avoid runtime errors.

  const typeErrors = () =>
  {
    // @ts-expect-error - Expected 1 argument, but got 0
    t.button.delete();

    // @ts-expect-error - Argument of type 'number' is not assignable to parameter of type 'string'
    t.button.delete(123);

    // @ts-expect-error - Expected 1 argument, but got 2
    t.message.hello('Bob', 'extra');

    // @ts-expect-error - Property 'nonexistent' does not exist
    t.button.nonexistent;

    // @ts-expect-error - Expected 2 arguments, but got 1
    t.button.confirmDelete(5);

    // @ts-expect-error - Argument of type 'string' is not assignable to parameter of type 'number'
    t.button.confirmDelete('five', 'files');

    // @ts-expect-error - button.cancel is not a function
    t.button.cancel();
  };

  const noTypeErrors = () =>
  {
    t.button.delete('your mom');
    t.message.hello('mom');
    t.message.welcome; // it's a string!
  };

  // Just assert that the function exists to satisfy the test runner
  assertEquals(typeof typeErrors, 'function');
  assertEquals(typeof noTypeErrors, 'function');
});
