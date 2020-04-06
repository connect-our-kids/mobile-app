import convertFileToMedia from './convertFileToMedia';
import parseBaseNameFromUri from './parseBaseNameFromUri';

test('converts uploaded file to media', () => {
    const file = {
        type: 'success',
        uri:
            'file:///private/var/mobile/Containers/Data/Application/1C4F36A9-C6F3-4194-81E9-39F68BCFC32A/tmp/host.exp.Exponent-Inbox/FireGIS-2-PDF-maps-for-smartphones-and-tablets.pdf',
        name: 'FireGIS-2-PDF-maps-for-smartphones-and-tablets.pdf',
        size: 2037439,
    };

    const media = {
        type: 'file',
        uri: file.uri,
        name: parseBaseNameFromUri(file.name), // ... as a precaution
        size: file.size,
    };

    expect(convertFileToMedia(file)).toMatchObject(media);
    expect(media.name).toBe(
        'FireGIS-2-PDF-maps-for-smartphones-and-tablets.pdf'
    );
    expect(media.uri).toBe(
        'file:///private/var/mobile/Containers/Data/Application/1C4F36A9-C6F3-4194-81E9-39F68BCFC32A/tmp/host.exp.Exponent-Inbox/FireGIS-2-PDF-maps-for-smartphones-and-tablets.pdf'
    );
    expect(media.size).toBe(2037439);
});
