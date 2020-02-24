module.exports = {

  'env': {
    'node': true,
    'es6': true,
  },
  'globals': {
    'Atomics': 'readonly',
    'SharedArrayBuffer': 'readonly',
  },

  /**********************************************************/

  'plugins': [
    'import',
    /* 'jsx-a11y', */
    'react',
    'react-native',
    /* 'react-native-a11y', */
    '@typescript-eslint',
  ],
  'extends': [
    'eslint:recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    /* 'plugin:jsx-a11y/recommended', */
    'plugin:react/recommended',
    /* 'plugin:react-native-a11y/recommended', */
  ],
  'parser': 'babel-eslint',
  'parserOptions': {
    'ecmaFeatures': {
      'jsx': true,
    },
    'ecmaVersion': 2018,
    'sourceType': 'module',
  },
  'overrides': [
    {
      'files': [ '*.ts', '*.tsx' ],
      'extends': [
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
      ],
      'parser': '@typescript-eslint/parser',
    },
  ],

  /**********************************************************/

  'rules': {

    /***************************************
      style
    ***************************************/

    /* general spacing */

    'indent': [
      'error', 4,
    ],
    'linebreak-style': [
      'error', 'unix',
    ],
    'eol-last': [
      'error', 'always',
    ],
    'no-irregular-whitespace': [
      'error',
    ],
    'no-multi-spaces': [
      'error',
    ],
    'no-trailing-spaces': [
      'error',
    ],
    'no-multiple-empty-lines': [
      'error', { 'max': 2 },
    ],

    /* comments */

    'spaced-comment': [
      'error', 'always', { 'exceptions': [ '/', '*', '+', '-', '=' ] },
    ],

    /* dots */

    'no-whitespace-before-property': [
      'error',
    ],
    'dot-location': [
      'error', 'property',
    ],

    /* commas */

    'comma-style': [
      'error', 'last',
    ],
    'comma-dangle': [
      'error',
      {
        'arrays': 'always-multiline',
        'exports': 'always-multiline',
        'functions': 'always-multiline',
        'imports': 'always-multiline',
        'objects': 'always-multiline',
      },
    ],
    'comma-spacing': [
      'error', { 'before': false, 'after': true },
    ],

    /* colons */

    'key-spacing': [
      'error', { 'beforeColon': false, 'afterColon': true },
    ],
    'switch-colon-spacing': [
      'error', { 'before': false, 'after': true },
    ],

    /* semicolons */

    'semi': [
      'error', 'always', { 'omitLastInOneLineBlock' : true },
    ],
    'semi-style': [
      'error', 'last',
    ],
    'semi-spacing': [
      'error', { 'before': false, 'after': true },
    ],

    /* quotes */

    'quotes': [
      'error', 'single',
    ],
    'quote-props': [
      'error', 'consistent',
    ],

    /* parens */

    'space-in-parens': [
      'error', 'never',
    ],

    /* keywords & blocks */

    'brace-style': [
      'error', 'stroustrup', { 'allowSingleLine': true },
    ],
    'curly': [
      'error', 'all',
    ],
    'space-before-blocks': [
      'error', 'always',
    ],
    'keyword-spacing': [
      'error', { 'before': true, 'after': true },
    ],

    /* functions */

    'arrow-parens': [
      'error', 'always',
    ],
    'arrow-spacing': [
      'error', { 'before': true, 'after': true },
    ],
    'space-before-function-paren': [
      'error',
      {
        'anonymous': 'always',
        'named': 'never',
        'asyncArrow': 'always',
      },
    ],
    'function-paren-newline': [
      'error', 'consistent',
    ],
    'function-call-argument-newline': [
      'error', 'consistent',
    ],

    /* arrays */

    'array-bracket-newline': [
      'error', 'consistent',
    ],
    'array-bracket-spacing': [
      'error', 'always',
    ],
    'array-element-newline': [
      'error', 'consistent',
    ],

    /* objects */

    'object-curly-newline': [
      'error', { 'consistent': true },
    ],
    'object-curly-spacing': [
      'error', 'always',
    ],
    'object-property-newline': [
      'error', { 'allowAllPropertiesOnSameLine': true },
    ],

    /* operators */

    'eqeqeq': [
      'warn', 'always',
    ],
    'no-mixed-operators': [
      'error',
    ],
    'operator-linebreak': [
      'error', 'before',
    ],
    'space-infix-ops': [
      'error',
    ],
    'space-unary-ops': [
      'error', { 'words': true, 'nonwords': false },
    ],

    /* scoping */
    
    'no-unused-vars': [
      'warn',
    ],
    'no-var': [
      'warn',
    ],
    'vars-on-top': [
      'error',
    ],
    'block-scoped-var': [
      'error',
    ],
    'no-use-before-define': [
      'warn',
    ],
    '@typescript-eslint/no-use-before-define': [
      'warn',
    ],

    /***************************************
      react
    ***************************************/

    'react/display-name': [
      'warn',
    ],
    'react/prop-types': [
      'off',
    ],
    'react/jsx-filename-extension': [
      'off',
    ],

    /***************************************
      react-native
    ***************************************/

    'react-native/no-unused-styles': [
      'warn',
    ],
    'react-native/split-platform-components': [
      'warn',
    ],
    'react-native/no-inline-styles': [
      'warn',
    ],
    'react-native/no-color-literals': [
      'warn',
    ],
    'react-native/no-raw-text': [
      'warn',
    ],

  },

};
