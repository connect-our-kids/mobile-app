export const name = (a: { fullName: string }, b: { fullName: string }) => {
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

export const lastName = (
    a: { lastName: string | null },
    b: { lastName: string | null }
) => {
    const A = a.lastName?.toUpperCase() ?? '';
    const B = b.lastName?.toUpperCase() ?? '';
    let comparison = 0;
    if (A > B) {
        comparison = 1;
    } else {
        comparison = -1;
    }
    return comparison;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const created = (a: { createdAt: any }, b: { createdAt: any }) => {
    const A = a.createdAt;
    const B = b.createdAt;
    let comparison = 0;
    if (A > B) {
        comparison = 1;
    } else {
        comparison = -1;
    }
    return comparison;
};

export const updated = (a: { updatedAt: never }, b: { updatedAt: never }) => {
    const A = a.updatedAt;
    const B = b.updatedAt;
    let comparison = 0;
    if (A > B) {
        comparison = 1;
    } else {
        comparison = -1;
    }
    return comparison;
};
