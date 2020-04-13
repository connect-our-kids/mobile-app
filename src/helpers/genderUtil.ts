export function genderEnumToString(gender: string): string {
    if (gender.toUpperCase() === 'M') {
        return 'Male';
    }

    if (gender.toUpperCase() === 'F') {
        return 'Female';
    }

    return '';
}
