import { v4 as uuidv4 } from 'uuid';

// Alert actions — a legacy toast-style alert system that predates react-toastify.
// NOTE: this path is effectively dead: `REMOVE_ALERT` below is never imported
// (there is no store/actions/types.js), the matching reducer isn't wired into
// the store, and the app now uses react-toastify for user messages. Left here
// for reference; setAlert would throw on the REMOVE_ALERT line if dispatched.

// setAlert — pushes a transient alert (message + type) with a unique id, then
// schedules its removal after 5 seconds.
export const setAlert = (message, alertType) => dispatch => {
    const id = uuidv4();
    dispatch({type: "setAlert", payload: {message, alertType, id}});

    setTimeout(() => dispatch({type: REMOVE_ALERT, payload: id}), 5000);
};
