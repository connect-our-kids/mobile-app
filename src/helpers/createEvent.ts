import axios from 'axios';
import { getEnvVars } from '../../environment';

const { eventTrackingURL } = getEnvVars();

// possiblePersonIndex: 0
// emailIndex: 0
// phoneIndex: 0
// addressIndex: 2
// urlIndex: 0
// relationshipIndex: 0

export const sendUserInfo = (emailAddress: string) => {
    axios.post(eventTrackingURL, { emailAddress });
};

export const sendEvent = async (
    emailAddress: string | undefined | null,
    verb: string,
    noun: string,
    outcome: string | null = null,
    options: Record<string, unknown> | null = null
) => {
    if (emailAddress === null) {
        emailAddress = 'anonymous@unknown.org';
    }
    const bodyObject: Record<string, unknown> = {};

    bodyObject['event'] = `${verb}-${noun}`;

    if (outcome !== null) {
        bodyObject['event'] += `-${outcome}`;
    }

    bodyObject['emailAddress'] = emailAddress;

    if (options !== null) {
        bodyObject['options'] = options;
    }

    try {
        const res = await axios.post(
            eventTrackingURL,
            JSON.stringify(bodyObject)
        );
        return res;
    } catch (err) {
        console.log('Event Tracking Error: ', err);
        return err;
    }
};

export const createOptions = (
    listLength: number | null,
    noun: string | null,
    index: unknown
): Record<string, unknown> => {
    const options: Record<string, unknown> = {};
    if (listLength === null) {
        options[`${noun}Index`] = index;

        return options;
    } else {
        options.possibleMatches = listLength;
        options.personMatch = listLength === 0;

        return options;
    }
};
