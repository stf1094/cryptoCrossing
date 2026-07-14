import { db } from '@/firebaseConfig';
import { getDoc, doc } from 'firebase/firestore';

// Profile actions — read-only access to the user's profile document
// (profiles/{uid}: uid, email, total). Writes to the profile happen elsewhere
// (updateTotal2 in portfolioAction.js, and account setup in authAction.js).

// getCurrentProfile — loads the profile doc for the given uid into the store.
export const getCurrentProfile = (uid) => async dispatch => {
    try {
       const profileDoc = doc(db, "profiles", uid);
       await getDoc(profileDoc).then(doc => dispatch({type: "getProfileSuccess", payload: doc.data()}));
    } catch(err) {
        console.error(err.message);
        dispatch({type: "profileError", payload: err.message});
    }
}
