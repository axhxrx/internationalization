# @axhxrx/internationalization

This library attempts to provide the simplest possible implementation of internationalization (sometimes nonsensically abbrieviated "i18n") for TypeScript projects.

The gist of it is that the canonical format for translation data is TypeScript, instead of JSON/YAML/etc. TypeScript code can then import the translations directly, without any extra build steps.

The drawback to this approach is that the translation format, although simple, may be unfamiliar to translators, and isn't widely compatible with other translation tools. That can be solved with a roundtrip converter to/from e.g. JSON, or whatever, but that is outside the scope of this library.

## Usage

Implement translations for your supported locales in one or more TypeScript files:

```ts
const localizations = {
  button: {
    erase: {
      en: 'Erase',
      ja: '消去' ,
    },
    ok: {
      en: 'OK',
      ja: 'OK',
    },
    cancel: {
      en: 'Cancel',
      ja: 'キャンセル',
    },
  }
};
```

In your app code, import the translations and then use them. E.g. in a web app template:

```ts
<button>
  {{ localize(localizations.button.erase) }}
</button>
```
(A future version this library will have a better example.)

Or, in a CLI tool:

```typescript

const menu = `
  1. ${localize(localizations.button.erase)}
  2. ${localize(localizations.button.cancel)}
`;
console.log(menu);
```

## Happenings

⏱️ 2025-01-19: version 0.0.5: add test for TypeScript type-checking performance (to avoid inadvertent introduction of "slow types")

🩹 2025-01-18: version 0.0.4: Fix missing export

✨ 2025-01-18: version 0.0.3: Add valueAtKeyPath() utility function

👹 2025-01-18: version 0.0.2 adds tree conversion with localizeAll(), and fixes up some type-related stuff

👹 2025-01-18: initial draft of implementation

🤖 2025-01-13: repo initialized by Bottie McBotface bot@axhxrx.com
