import { db } from '@/firebaseConfig';
import { getDoc, doc } from 'firebase/firestore';

// get full profile 
export const getCurrentProfile = (uid) => async dispatch => {
    try {
       const profileDoc = doc(db, "profiles", uid);
       await getDoc(profileDoc).then(doc => dispatch({type: "getProfileSuccess", payload: doc.data()}));
    } catch(err) {
        console.log(err.message);
        dispatch({type: "profileError", payload: err.message});
    }
}
