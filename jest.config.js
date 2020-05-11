/***********************************************************
  jest.config
***********************************************************/

function getBaseConfig() {
    return {
        /***************************************
            CODE TRANSFORMATION (transpilation)
        ***************************************/

        /* DO test... */
        moduleFileExtensions: [
            /* JSON */
            'json',

            /* JavaScript */
            'js',
            'jsx',

            /* TypeScript */
            'ts',
            'tsx',
        ],

        /* DO transform... */
        transform: {
            /* JavaScript */
            '^.+\\.(js|jsx)$': 'babel-jest',

            /* TypeScript */
            '^.+\\.(ts|tsx)$': 'babel-jest',
        },

        /**************************************/
    };
}

function getBaseCoverageConfig() {
    return {
        /***************************************
            CODE COVERAGE
        ***************************************/

        /* DO NOT collect (by default) */
        collectCoverage: false,

        /* DO count files matching... */
        collectCoverageFrom: [
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
}

/**********************************************************/

module.exports = {
    /* Limit testing to... */
    projects: [
        /* Android */
        {
            preset: 'jest-expo/android',
            testMatch: ['<rootDir>/src/**/*[-.]{test,spec}.{js,jsx,ts,tsx}'],
            testPathIgnorePatterns: [
                '<rootDir>/node_modules/',
                '<rootDir>/build/',
            ],
            transformIgnorePatterns: [
                'node_modules/(?!(jest-)?react-native|react-clone-referenced-element|@react-native-community|expo(nent)?|@expo(nent)?/.*|react-navigation|@react-navigation/.*|@unimodules/.*|sentry-expo|native-base|@sentry.*|unimodules-permissions-interface)',
            ],

            ...getBaseConfig(),
            ...getBaseCoverageConfig(),
        },

        /* iOS */
        {
            preset: 'jest-expo/ios',
            testMatch: ['<rootDir>/src/**/*[-.]{test,spec}.{js,jsx,ts,tsx}'],
            testPathIgnorePatterns: [
                '<rootDir>/node_modules/',
                '<rootDir>/build/',
            ],
            transformIgnorePatterns: [
                'node_modules/(?!(jest-)?react-native|react-clone-referenced-element|@react-native-community|expo(nent)?|@expo(nent)?/.*|react-navigation|@react-navigation/.*|@unimodules/.*|sentry-expo|native-base|@sentry.*|unimodules-permissions-interface)',
            ],

            ...getBaseConfig(),
            ...getBaseCoverageConfig(),
        },
    ],
};
