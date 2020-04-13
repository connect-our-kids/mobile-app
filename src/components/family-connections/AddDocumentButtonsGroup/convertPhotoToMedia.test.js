import convertPhotoToMedia from './convertPhotoToMedia';
import parseBaseNameFromUri from './parseBaseNameFromUri';

test('Returns object with photo to media conversion', () => {
    const uri = 'https://www.testphoto.com/images/photos/test/this.jpg';

    const expected = {
        type: 'image',
        uri: 'string',
        name: parseBaseNameFromUri(uri),
        width: Number.isInteger(1),
        height: Number.isInteger(1),
    };

    const received = {
        type: 'image',
        uri: 'string',
        name: parseBaseNameFromUri(expected.uri),
        width: Number.isInteger(1),
        height: Number.isInteger(1),
    };

    expect(convertPhotoToMedia(expected)).toMatchObject(received);
});
