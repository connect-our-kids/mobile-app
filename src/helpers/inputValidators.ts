export const isValidName = (name: string) => {
    if (name.length) {
        const numberOfWords = name.trim().split(' ').length;
        const isNumberOfWordsTwoOrThree =
            numberOfWords === 2 || numberOfWords === 3;
        const nameIsNotANumber = name.replace(/[^0-9]+/g, '').length === 0;

        return isNumberOfWordsTwoOrThree && nameIsNotANumber;
    }
    return false;
};

export const isValidEmail = (email: string) => {
    if (email.length) {
        const isValidEmail = email.trim().split('@').length;
        return isValidEmail === 2;
    }
    return false;
};

export const isValidCityState = (cityState: string) => {
    if (cityState.length) {
        const isValidCityState = cityState.trim().split(' ').length;
        return isValidCityState === 2;
    }
    return false;
};

export const isValidAddress = (address: string) => {
    if (address.length) {
        const isValidAddress = address.trim().split(' ').length;
        return isValidAddress > 3;
    }
    return false;
};

export const isValidPhone = (phone: string) => {
    if (phone.trim()) {
        const numbersOnly = phone.replace(/[^0-9]+/g, '');
        return numbersOnly.length === 10;
    }
};

export const isValidUrl = (url: string) => {
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
