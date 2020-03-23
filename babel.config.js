module.exports = function (api) {

    api.cache(true);

    return {

        'presets': [
            'babel-preset-expo',
        ],

        // 'env': {
        //     'test': {
        //         'plugins': [
        //             '@babel/plugin-transform-modules-commonjs',
        //         ],
        //     },
        // },

    };

};
