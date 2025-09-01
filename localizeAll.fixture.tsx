export const localizationWithReactElements = {
  hello: {
    en: (name: string) => <>{`Hello, ${name}!`}</>,
    ja: (name: string) => <>{`こんにちは、${name}さん！`}</>,
    de: (name: string) => <>{`Hallo, ${name}!`}</>,
  },
};
