/***********************************************************
  jest.config
***********************************************************/

module.exports = {

    /***************************************
        WHAT TO TEST
    ***************************************/

    /* Limit testing to... */
    'projects': [

        /* Android */
        {
            'preset': 'jest-expo/android',
        },

        /* iOS */
        {
            'preset': 'jest-expo/ios',
        },

    ],

    /* DO test... */
    'moduleFileExtensions': [

        /* JSON */
        'json',

        /* JavaScript */
        'js',
        'jsx',

        /* TypeScript */
        'ts',
        'tsx',

    ],

    /***************************************
        CODE TRANSFORMATION (transpilation)
    ***************************************/

    /* DO transform... */
    'transform': {

        /* JavaScript */
        '^.+\\.js[x]?$': 'babel-jest',

        /* TypeScript */
        '^.+\\.ts[x]?$': 'babel-jest',

    },

    /* DO NOT transform... */
    'transformIgnorePatterns': [

        /*
        ... as directed by Expo
        source: <https://docs.expo.io/versions/latest/guides/testing-with-jest/#jest-configuration>
        */
        'node_modules/(?!(jest-)?react-native|react-clone-referenced-element|@react-native-community|expo(nent)?|@expo(nent)?/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base)',

    ],

    /***************************************
        CODE COVERAGE
    ***************************************/

    /* DO NOT collect (by default) */
    'collectCoverage': false,

    /* DO count files matching... */
    'collectCoverageFrom': [

        /* JavaScript files */
        '**/*.{js,jsx}',

        /* TypeScript files */
        '**/*.{ts,tsx}',

        /* --- EXCLUDING --- */

        /* dependencies */
        '!**/*_modules/**',
        '!**/*_packages/**',

        /* configuration files */
        '!**/.*rc.{js,ts}',
        '!**/*.config.{js,ts}',
        '!**/*.setup.{js,ts}',

        /* builds */
        '!<rootDir>/build/**',

    ],

    /**************************************/

};
