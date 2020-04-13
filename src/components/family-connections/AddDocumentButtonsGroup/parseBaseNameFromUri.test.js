import parseBaseNameFromUri from './parseBaseNameFromUri';

test('parses base name from URI', () => {
    const uri = 'https://www.bigstockphoto.com/images/homepage/module-6.jpg';
    expect(parseBaseNameFromUri(uri)).toBe('module-6.jpg');
});

it('parses base name from URI', () => {
    const uri =
        'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf';
    expect(parseBaseNameFromUri(uri)).toBe('dummy.pdf');
});

it('parses base name from URI', () => {
    const uri = 'https://upload.wikimedia.org/wikipedia/commons/d/d9/Test.png';
    expect(parseBaseNameFromUri(uri)).toBe('Test.png');
});
