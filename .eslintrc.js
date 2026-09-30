module.exports = {
  env: {
    browser: true,
    es2021: true,
    'react-native/react-native': true,
  },
  extends: [
    '@react-native',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'airbnb',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
    'prettier',
    'plugin:storybook/recommended',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
    __DEV__: 'readonly',
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
    warnOnUnsupportedTypeScriptVersion: false,
  },
  plugins: ['react', 'react-hooks', '@typescript-eslint', 'prettier'],
  rules: {
    'prettier/prettier': [
      'error',
      {
        endOfLine: 'auto',
        singleQuote: true,
        semi: true,
        printWidth: 180
      },
    ],
    // 'no-console': ['warn', { allow: ['tron'] }],
    'no-console': 'error',
    'spaced-comment': ['error', 'always', { markers: ['/'] }],
    'import/prefer-default-export': 'off',
    'class-methods-use-this': 'off',
    'no-unused-expressions': 'off',
    'no-unused-vars': 'off',
    'no-shadow': 'off',

    // TypeScript
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-unused-expressions': 'error',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-shadow': 'warn',
    'react/prop-types': 'off', // Since we do not use prop-types,
    'react/require-default-props': 'off', // Since we do not use prop-types
    // prevent eslint to complain about the "styles" variable being used before it was defined
    'no-use-before-define': 'off',
    '@typescript-eslint/no-use-before-define': ['error'],
    allowAsProps: 'off',
    'react/no-unstable-nested-components': 'off',
    'import/no-cycle': [2, { maxDepth: 1 }],
    // React
    'react/jsx-props-no-spreading': 'off',
    'react/react-in-jsx-scope': 'off',
    // allow .js files to contain JSX code
    'react/jsx-filename-extension': [
      'warn',
      {
        extensions: ['js', 'jsx', '.ts', '.tsx'],
      },
    ],
    'jsx-a11y/anchor-is-valid': [
      'error',
      {
        specialLink: ['hrefLeft', 'hrefRight'],
        aspects: ['noHref', 'invalidHref', 'preferButton'],
      },
    ],

    // ignore errors for the react-navigation package
    'react/prop-types': 'off',

    // React Hooks
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',

    // ignore errors for import directives
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'never',
        jsx: 'never',
        ts: 'never',
        tsx: 'never',
      },
    ],

    // Storybook
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: [
          '**/*.stories.*',
          '**/.storybook/**/*.*',
          '**/*.test.*',
          '**/.test/**/*.*',
          '**/config/env/**',
        ],
        peerDependencies: true,
      },
    ],
    'react/function-component-definition': [
      2,
      {
        namedComponents: 'arrow-function',
        unnamedComponents: 'arrow-function',
      },
    ],
  },
  settings: {
    'import/resolver': {
      node: {
        paths: ['./src'],
      },
      'babel-module': {},
    },
  },
  ignorePatterns: ['*.js'],
  overrides: [
    {
      files: ['*.stories.tsx'],
      rules: {
        'import/no-anonymous-default-export': 'off',
      },
    },
  ],
};
