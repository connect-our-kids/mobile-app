/***********************************************************
  jest.config
***********************************************************/

module.exports = {

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
        /* JSON files (*.json) */
        'json',
        /* JavaScript files (*.{js, jsx}) */
        'js',
        'jsx',
        /* TypeScript files (*.{ts, tsx}) */
        'ts',
        'tsx',
    ],

    /* DO transform... */
    'transform': {
        /* JavaScript files (*.{js, jsx}) */
        '^.+\\.js[x]?$': 'babel-jest',
        /* TypeScript files (*.{ts, tsx}) */
        '^.+\\.ts[x]?$': 'babel-jest',
    },

    /* DO NOT transform... */
    'transformIgnorePatterns': [
        /*
        Files as directed by Expo.
        source: <https://docs.expo.io/versions/latest/guides/testing-with-jest/#jest-configuration>
        */
        'node_modules/(?!(jest-)?react-native|react-clone-referenced-element|@react-native-community|expo(nent)?|@expo(nent)?/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base)',
    ],

};
