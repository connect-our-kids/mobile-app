module.exports = {
    'preset': 'jest-expo',
    'moduleFileExtensions': [ 'json', 'js', 'jsx', 'ts', 'tsx' ],
    'transform': {
        '^.+\\.[t|j]sx?$': 'babel-jest',
    },
    'transformIgnorePatterns': [
        'node_modules/(?!(jest-)?react-native|react-clone-referenced-element|@react-native-community|expo(nent)?|@expo(nent)?/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base)',
    ],
};
