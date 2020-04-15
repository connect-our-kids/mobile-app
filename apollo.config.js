module.exports = {
    client: {
        service: {
            name: 'mobile-app',
            includes: ['src/**/*.ts{,x}'],
            localSchemaFile: './schema.gql',
        },
        excludes: ['./schema.gql'],
    },
};
