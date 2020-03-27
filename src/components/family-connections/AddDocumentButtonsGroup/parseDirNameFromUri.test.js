import parseDirNameFromUri from './parseDirNameFromUri';

test('Correctly parses directory', () => {
    const dir = 'dir1/dir2/dir3/';
    const uri = `https://example.com/${dir}resource.txt#fragment`;
    expect(parseDirNameFromUri(uri)).toBe(`/${dir}`);
});

test('Correctly parses directory when only base name', () => {
    const dir = '';
    const uri = `https://example.com/${dir}resource.txt#fragment`;
    expect(parseDirNameFromUri(uri)).toBe(`/${dir}`);
});
