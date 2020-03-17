import parseDirNameFromPath from './parseDirNameFromPath';

const spy1 = jest.fn();
spy1('/dir/name/test-file.ext');

test('Function is called', () => {
    expect(spy1).toHaveBeenCalledWith('/dir/name/test-file.ext');
});

test('Functions receives path', () => {
    expect(parseDirNameFromPath('/dir/name/base-name.ext')).toBe('/dir/name/');
    expect(parseDirNameFromPath('/dir/name/test-file.ext')).toBe('/dir/name/');
});
