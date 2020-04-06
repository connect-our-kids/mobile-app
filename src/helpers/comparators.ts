import { casesDetail_cases_person } from '../generated/casesDetail';

export const name = (
    a: casesDetail_cases_person,
    b: casesDetail_cases_person
) => {
    const A = a.fullName.toUpperCase();
    const B = b.fullName.toUpperCase();
    let comparison = 0;
    if (A > B) {
        comparison = 1;
    } else {
        comparison = -1;
    }
    return comparison;
};

export const lastName = (a, b) => {
    const A = a.last_name.toUpperCase();
    const B = b.last_name.toUpperCase();
    let comparison = 0;
    if (A > B) {
        comparison = 1;
    } else {
        comparison = -1;
    }
    return comparison;
};

export const created = (a, b) => {
    const A = a.created_at;
    const B = b.created_at;
    let comparison = 0;
    if (A > B) {
        comparison = 1;
    } else {
        comparison = -1;
    }
    return comparison;
};

export const updated = (a, b) => {
    const A = a.updated_at;
    const B = b.updated_at;
    let comparison = 0;
    if (A > B) {
        comparison = 1;
    } else {
        comparison = -1;
    }
    return comparison;
};
