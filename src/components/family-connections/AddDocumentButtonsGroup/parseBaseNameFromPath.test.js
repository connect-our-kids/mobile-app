import parseBaseNameFromPath from './parseBaseNameFromPath';

test('clear characters before and including the LAST  or /', () => {
    expect(parseBaseNameFromPath('/dir/name/base-name.ext')).toBe(
        'base-name.ext'
    );
});

it('clear characters before and including the LAST  or / 2', () => {
    expect(parseBaseNameFromPath('/dir/name/base-name')).toBe('base-name');
});

it('clear characters before and including the LAST  or / 3', () => {
    expect(parseBaseNameFromPath('/dir/name/')).toBeFalsy();
});
