module.exports = {

    /***********************************************************
        common settings
    ***********************************************************/

    'parser': 'babel-eslint',

    'parserOptions': {
        'sourceType': 'module',
        'ecmaVersion': 2018,
        'ecmaFeatures': {
            'jsx': true,
        },
    },

    'env': {
        'es6': true,
        'browser': true,
    },

    'globals': {
        'Atomics': 'readonly',
        'SharedArrayBuffer': 'readonly',
    },

    'plugins': [
        'import',
        /* 'jsx-a11y', */
        'react',
        'react-native',
        /* 'react-native-a11y', */
        '@typescript-eslint',
        'jest',
        'prettier',
    ],

    'extends': [
        'eslint:recommended',
        'plugin:import/errors',
        'plugin:import/warnings',
        'plugin:import/typescript',
        /* 'plugin:jsx-a11y/recommended', */
        'plugin:react/recommended',
        /* 'plugin:react-native-a11y/recommended', */
        'plugin:jest/recommended',
        'plugin:jest/style',
        'prettier/@typescript-eslint',
        'prettier/react',
        'prettier',
    ],

    "ignorePatterns": ["/src/generated", "**/*.md", "/node_modules/**/*.*"],

    'settings': {
        "react": {
            "createClass": "createReactClass", // Regex for Component Factory to use,
                                                // default to "createReactClass"
            "pragma": "React",  // Pragma to use, default to "React"
            "version": "detect", // React version. "detect" automatically picks the version you have installed.
                                    // You can also use `16.0`, `16.3`, etc, if you want to override the detected value.
                                    // default to latest and warns if missing
                                    // It will default to "detect" in the future
            },

        'import/extensions': [ '.js', '.jsx', '.ts', '.tsx' ],

        'import/parsers': {
            '@typescript-eslint/parser': [ '.ts', '.tsx' ],
        },

        'import/ignore': [
            /* these modules export dynamically, so 'import/named' falsely reports errors */
            'react-native-elements',
            'react-native-gesture-handler',
            'react-native-picker-dropdown',
        ],

    },

    /***********************************************************
        commmon rules
    ***********************************************************/

    'rules': {

        /***************************************
            style
        ***************************************/

        // all styling is handled by prettier.
        // Configure in .prettierrc.js file
        "prettier/prettier": "error",


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
            'off',
        ],
        'react-native/no-color-literals': [
            'off',
        ],
        'react-native/no-raw-text': [
            'warn',
        ],

    },

    /***********************************************************
        overrides
    ***********************************************************/

    'overrides': [

        /***************************************
            TypeScript
        ***************************************/
        {
            'files': [ '*.{ts,tsx}' ],

            /* settings */

            'parser': '@typescript-eslint/parser',

            'extends': [
                'plugin:@typescript-eslint/eslint-recommended',
                'plugin:@typescript-eslint/recommended',
            ],

            /* rules */

            'rules': {

                /* scoping */

                '@typescript-eslint/no-use-before-define': [
                    'warn',
                ],
                "@typescript-eslint/camelcase": ["off"],
                "@typescript-eslint/explicit-function-return-type": ["off", {
                    'allowExpressions': true,
                    'allowTypedFunctionExpressions': true,
                    'allowHigherOrderFunctions': true,
                }]
            },
        },

        /***************************************
            testing
        ***************************************/
        {
            'files': [ '*[-.]{test,spec}.{js,jsx,ts,tsx}' ],

            /* settings */

            'env': {
                'es6': true,
                'node': true,
                'browser': false,
                'jest/globals': true,
            },
        },
    ],

};
