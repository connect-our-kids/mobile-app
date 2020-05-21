import moment from 'moment';

interface PersonSubtitleDetails {
    gender: string;
    birthMonth: number | null;
    birthYear: number | null;
    dayOfBirth: number | null;
    birthdayRaw: string | null;
}

function birthdayAsMoment(
    person: PersonSubtitleDetails
): { birthday: moment.Moment; isApproximate: boolean } | undefined {
    let birthday: moment.Moment | undefined = undefined;
    let isApproximate = true;
    if (person.birthYear && person.birthMonth && person.dayOfBirth) {
        birthday = moment(
            `${person.birthMonth}/${person.dayOfBirth}/${person.birthYear}`,
            'MM/DD/YYYY'
        );
        isApproximate = false;
    } else if (person.birthYear && person.birthMonth) {
        birthday = moment(
            `${person.birthMonth}/${person.birthYear}`,
            'MM/YYYY'
        );
    } else if (person.birthYear) {
        birthday = moment(`${person.birthYear}`, 'YYYY');
    } else if (person.birthdayRaw) {
        // try to parse just year out
        const regex = /([\d]{4})/i;
        const match = person.birthdayRaw.match(regex);
        if (match) {
            const year = Number(match[1]);
            if (year > 1800 && year <= moment().year()) {
                birthday = moment([year]);
            }
        }
    }

    return birthday ? { birthday, isApproximate } : undefined;
}

function toAgeString(person: PersonSubtitleDetails): string | undefined {
    const birthday = birthdayAsMoment(person);

    if (birthday) {
        const prefix = birthday.isApproximate ? '~' : '';

        let age = moment().diff(birthday.birthday, 'years');
        // get age in years
        if (age > 1) {
            return `${prefix}${age} years old`;
        } else if (age === 1) {
            return `${prefix}${age} year old`;
        }

        // get age in months
        age = moment().diff(birthday.birthday, 'months');
        if (age > 1) {
            return `${prefix}${age} months old`;
        } else if (age === 1) {
            return `${prefix}${age} month old`;
        }

        // get age in days
        age = moment().diff(birthday.birthday, 'days');
        if (age > 1 || age === 0) {
            return `${prefix}${age} days old`;
        } else {
            return `${prefix}${age} day old`;
        }
    }

    return undefined;
}
export function createPersonSubtitle(person: PersonSubtitleDetails) {
    const ageString = toAgeString(person);
    const genderCheck = person.gender === 'Unspecified' ? ' ' : person.gender;
    const isEmpty = genderCheck.trim().length <= 0;
    if (ageString) {
        return isEmpty ? `${ageString}` : `${genderCheck}, ${ageString}`;
    } else if (person.birthdayRaw) {
        return isEmpty
            ? `Birth: ${person.birthdayRaw}`
            : `${genderCheck}, Birth: ${person.birthdayRaw}`;
    } else {
        return genderCheck;
    }
}
