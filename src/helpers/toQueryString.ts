export default (params: Record<string, any>) => {
    return (
        '?' +
        Object.entries(params)
            .map(
                ([key, value]) =>
                    `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
            )
            .join('&')
    );
};
