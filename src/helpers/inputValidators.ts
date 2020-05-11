export const isName = (name) => {
    if (name.length) {
        const numberOfWords = name.trim().split(' ').length;
        const isNumberOfWordsTwoOrThree =
            numberOfWords === 2 || numberOfWords === 3;
        const nameIsNotANumber = name.replace(/[^0-9]+/g, '').length === 0;

        return isNumberOfWordsTwoOrThree && nameIsNotANumber;
    }
    return false;
};

export const isEmail = (email) => {
    if (email.length) {
        const isValidEmail = email.trim().split('@').length;
        return isValidEmail === 2;
    }
    return false;
};

export const isCityState = (citystate) => {
    if (citystate.length) {
        const isValidCityState = citystate.trim().split(' ').length;
        return isValidCityState === 2;
    }
    return false;
};

export const isAddress = (address) => {
    if (address.length) {
        const isValidAddress = address.trim().split(' ').length;
        return isValidAddress > 3;
    }
    return false;
};

export const isPhone = (phone) => {
    if (phone.length) {
        const numbersOnly = phone.replace(/[^0-9]+/g, '');

        return numbersOnly.length === 10;
    }
};

export const isUrl = (url) => {
    if (url.length) {
        const pattern = new RegExp(
            '^(https?:\\/\\/)?' + // protocol
            '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
            '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
            '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
            '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
                '(\\#[-a-z\\d_]*)?$',
            'i'
        ); // fragment locator
        return !!pattern.test(url);
    }
    return false;
};
