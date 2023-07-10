import { v4 as uuidv4 } from 'uuid';

export const setAlert = (message, alertType) => dispatch => {
    const id = uuidv4();
    dispatch({type: "setAlert", payload: {message, alertType, id}});

    setTimeout(() => dispatch({type: REMOVE_ALERT, payload: id}), 5000);
};
