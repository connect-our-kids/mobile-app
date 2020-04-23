import axios from 'axios';
import { getEnvVars } from '../../../environment';
import { getAuthToken } from '../../helpers/auth';
export const POST_CONNECTION_ENGAGEMENTS_START =
    'POST_CONNECTION_ENGAGEMENTS_START';
export const POST_CONNECTION_ENGAGEMENTS_SUCCESS =
    'POST_CONNECTION_ENGAGEMENTS_SUCCESS';
export const POST_CONNECTION_ENGAGEMENTS_FAILURE =
    'POST_CONNECTION_ENGAGEMENTS_FAILURE';
export const POST_CONNECTION_DOCUMENT_START = 'POST_CONNECTION_DOCUMENT_START';
export const POST_CONNECTION_DOCUMENT_SUCCESS =
    'POST_CONNECTION_DOCUMENT_SUCCESS';
export const POST_CONNECTION_DOCUMENT_FAILURE =
    'POST_CONNECTION_DOCUMENT_FAILURE';
export const CLEAR_CONNECTION_ENGAGEMENTS = 'CLEAR_CONNECTION_ENGAGEMENTS';

// this action grabs all the engagements for a specified connection

// define familyConnectionsURL from environment for axios calls
const { familyConnectionsURL } = getEnvVars();

export const postConnectionEngagements = (
    id,
    note,
    subject,
    dataType,
    dueDate,
    isPublic
) => (dispatch) => {
    getAuthToken().then((accessToken) => {
        const body = {
            subject: subject ? subject : '',
            notes: note,
            data_type: dataType,
            due_date: dueDate,
            is_public: isPublic,
            person: id,
        };
        dispatch({ type: POST_CONNECTION_ENGAGEMENTS_START });
        axios
            .post(
                `${familyConnectionsURL}/api/v1/person/${id}/histories/`,
                body,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            )
            .then((res) => {
                dispatch({
                    type: POST_CONNECTION_ENGAGEMENTS_SUCCESS,
                    payload: res.data,
                });
            })
            .catch((error) => {
                dispatch({
                    type: POST_CONNECTION_ENGAGEMENTS_FAILURE,
                    payload: error.data,
                });
            });
    });
};

export const postConnectionDocument = (
    id,
    title,
    category,
    isPublic,
    notes,
    attachment
) => (dispatch) => {
    const createFormBody = () => {
        const formBody = new FormData();
        formBody.append('title', title ? title : 'untitled'); // a title is required by the backend
        formBody.append('category', category);
        formBody.append('tags', '[]');
        formBody.append('is_public', isPublic);
        formBody.append('notes', notes);
        formBody.append('person', id);
        formBody.append('attachment', attachment);
        return formBody;
    };

    getAuthToken().then((accessToken) => {
        dispatch({ type: POST_CONNECTION_DOCUMENT_START });
        axios
            .post(
                `${familyConnectionsURL}/api/v1/documents/`,
                createFormBody(),
                {
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            )
            .then((res) => {
                dispatch({
                    type: POST_CONNECTION_DOCUMENT_SUCCESS,
                    payload: res.data,
                });
            })
            .catch((error) => {
                dispatch({
                    type: POST_CONNECTION_DOCUMENT_FAILURE,
                    payload: error,
                });
            });
    });
};

export const clearConnectionEngagements = () => (dispatch) => {
    dispatch({ type: CLEAR_CONNECTION_ENGAGEMENTS });
};
