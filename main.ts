import { localize } from './localize.ts';

export function main()
{
  const loc = {
    greeting: {
      en: 'Hello, this is @axhxrx/internationalization,',
      ja: 'こんにちは、@axhxrx/internationalization です',
      de: 'Hallo, ich bin @axhxrx/internationalization',
      es: 'Hola, soy @axhxrx/internationalization',
      fr: 'Bonjour, je suis @axhxrx/internationalization',
      pt: 'Olá, sou o @axhxrx/internationalization',
      it: 'Ciao, sono @axhxrx/internationalization',
      ko: '안녕하세요, @axhxrx/internationalization 입니다',
      zh: '你好,我是 @axhxrx/internationalization',
      tr: "Merhaba, @axhxrx/internationalization'i kullanıyorum",
    },
  } as const;

  const keys = Object.keys(loc.greeting) as Array<keyof typeof loc.greeting>;

  const threeRandomLocales = [...keys].sort(() => Math.random() - 0.5).slice(0, 3);

  console.log(localize(loc.greeting, { locale: threeRandomLocales[0] }));
  console.log(localize(loc.greeting, { locale: threeRandomLocales[1] }));
  console.log(localize(loc.greeting, { locale: threeRandomLocales[2] }));

  const menu = `
  1. ${localize(loc.greeting, { locale: threeRandomLocales[0] })}
  3. ${localize(loc.greeting, { locale: threeRandomLocales[2] })}    
`
  console.log(menu);
}
