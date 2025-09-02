export const localizationWithReactElements = {
  hello: {
    en: (name: string) => <>{`Hello, ${name}!`}</>,
    ja: (name: string) => <>{`こんにちは、${name}さん！`}</>,
    de: (name: string) => <>{`Hallo, ${name}!`}</>,
  },
  string: {
    en: 'a string',
    ja: '文字列',
    de: 'Zeichenkette',
  },
};
