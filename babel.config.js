module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      ['babel-plugin-inline-import', {
        extensions: ['.md']
      }],
      [
        'module-resolver',
        {
          alias: {
            'isomorphic-webcrypto': 'isomorphic-webcrypto/src/react-native',
            'fast-text-encoding': 'fast-text-encoding/text',
            'jsonld': '@digitalcredentials/jsonld',
            'jsonld-signatures': '@digitalcredentials/jsonld-signatures',
          },
        },
      ],
    ],
  };
};
