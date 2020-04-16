import axios from 'axios';
import { getEnvVars } from '../../environment';

const { eventTrackingURL } = getEnvVars();

// possiblePersonIndex: 0
// emailIndex: 0
// phoneIndex: 0
// addressIndex: 2
// urlIndex: 0
// relationshipIndex: 0

export const sendUserInfo = (emailAddress) => {
    axios.post(eventTrackingURL, { emailAddress });
};

export const sendEvent = (
    emailAddress: string | undefined | null,
    verb: string,
    noun: string,
    outcome: string | null = null,
    options: Record<string, any> | null = null
) => {
    if (emailAddress === null) {
        emailAddress = 'anonymous@unknown.org';
    }
    const bodyObject = {};

    bodyObject['event'] = `${verb}-${noun}`;

    if (outcome !== null) {
        bodyObject['event'] += `-${outcome}`;
    }

    bodyObject['emailAddress'] = emailAddress;

    if (options !== null) {
        bodyObject['options'] = options;
    }

    return axios
        .post(eventTrackingURL, JSON.stringify(bodyObject))
        .then((res) => {
            return res;
        })
        .catch((err) => {
            console.error('Event Tracking Error: ', err);
            return err;
        });
};

export const createOptions = (listLength, noun, index): Record<string, any> => {
    const options: Record<string, any> = {};
    if (listLength === null) {
        options[`${noun}Index`] = index;

        return options;
    } else {
        options.possibleMatches = listLength;
        options.personMatch = listLength === 0;

        return options;
    }
};
