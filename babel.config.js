module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'module:react-native-dotenv',
      {
        moduleName: 'react-native-dotenv',
        safe: true,
        allowUndefined: true,
      },
    ],
    [
      'module-resolver',
      {
        root: ['./src'],
        alias: {
          assets: './src/assets',
          screens: './src/screens',
          navigation: './src/navigation',
          services: './src/services',
          hooks: './src/hooks',
          config: './src/config',
          components: './src/components',
          wrappers: './src/wrappers',
          utils: './src/utils',
          app: './src/app',
          store: './src/store',
          styles: './src/styles',
          const: './src/const',
          locales: './src/locales',
        },
      },
    ],
    'react-native-reanimated/plugin',
    '@babel/plugin-proposal-export-namespace-from',
    ['@babel/plugin-transform-class-properties', { loose: true }],
    ['@babel/plugin-transform-private-methods', { loose: true }],
    ['@babel/plugin-transform-private-property-in-object', { loose: true }]
  ],
};
