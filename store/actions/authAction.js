import {auth, db} from '../../firebaseConfig';
import {setAlert} from './alertAction';
import {
    signInWithEmailAndPassword, signOut,
    onAuthStateChanged, createUserWithEmailAndPassword,
    sendEmailVerification, updateEmail,
    updatePassword, sendPasswordResetEmail,
    deleteUser, reauthenticateWithCredential,
    setPersistence, browserLocalPersistence,
    signInAnonymously
  } from 'firebase/auth';
import { collection, doc, getDocs, addDoc, setDoc, Timestamp, updateDoc, deleteDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';

// Register User from tutorial
 export const register = (email, password) => async dispatch => {
    if (password.length < 7) {
        toast.warning("Passwords must be at least 7 characters.")
    } else {
        try {
            dispatch({type: "registerRequest"});
            const res = await createUserWithEmailAndPassword(auth, email, password);
            const { user } = res;
            const userProfile = {
                uid: user.uid,
                email: email,
                total: 0
               }
            const createProfile = (userProfile) => {
                setDoc(doc(db, "profiles", user.uid), userProfile);
            }
            createProfile(userProfile);
            dispatch({type: "registerSuccess", payload: user});
            dispatch(setUser());
        } catch(error) {
            const errors = error.message;
            if (errors) {
                console.error(errors);
                dispatch({type: "registerFail", payload: errors});
                if (errors === "Firebase: Error (auth/email-already-in-use).") {
                    toast.error("Error in signing up. This email is already in use.");
                } else {
                    toast.error("Error in signing up. Please try again...");
                }

            }
        }
    }
}

//Delete account -- removes the user's coins, profile doc, and auth user
export const deleteAccount = () => async dispatch => {
    const user = auth.currentUser;
    if (!user) return;
    try {
        // delete every coin in the user's subcollection first
        const coinsColl = collection(db, 'profiles', user.uid, 'coins');
        const snapshot = await getDocs(coinsColl);
        await Promise.all(
            snapshot.docs.map((coinDoc) =>
                deleteDoc(doc(db, 'profiles', user.uid, 'coins', coinDoc.id))
            )
        );
        // then the profile document
        await deleteDoc(doc(db, 'profiles', user.uid));
        // finally the auth user (requires a recent login)
        await deleteUser(user);
        dispatch({type: "clearPortfolio"});
        dispatch({type: "clearProfile"});
        dispatch({type: "logoutSuccess"});
        toast.success("Your account has been deleted.");
    } catch(err) {
        console.error(err.message);
        if (err.code === "auth/requires-recent-login") {
            toast.error("Please log in again before deleting your account.");
        } else {
            toast.error("Could not delete your account. Please try again...");
        }
    }
}

//set user
export const setUser = () => dispatch => {
    try {
        dispatch({type: "loadUserRequest"});
        onAuthStateChanged(auth, (user) => {
            if(user) {
                dispatch({type: "loadUserSuccess", payload: user});
                setPersistence(auth, browserLocalPersistence);
            } else {
                dispatch({type: "loadUserFail", payload: "no user at this time"});
            }
        });
    } catch(err) {
        dispatch({type: "loadUserFail", payload: err.message});
        console.error(err.message);
    }
}

export const login = (email, password) => async dispatch => {
    try {
        await signInWithEmailAndPassword(auth, email, password)
        .then(user => {
            dispatch({type: "loginRequest"});
            dispatch({type: "loginSuccess", payload: user});
            dispatch(setUser());
        }).catch(err => {
            const errors = err.message;
            console.error(errors);
            if (errors === 'Firebase: Error (auth/user-not-found).') {
                toast.error("No account associated with this email.");
                dispatch({type: "loginFail", payload: errors});
            }
            else if (errors === "Firebase: Error (auth/wrong-password).") {
                toast.error("You've entered the wrong password.");
                dispatch({type: "loginFail", payload: errors});
            } else {
               dispatch({type: "loginFail", payload: errors});
               toast.error("Could not login. Please try again...");
            }
           });
        } catch(err) {
            console.error(err.message);
            dispatch({type: "loginFail", payload: err.message});
            toast(err.message);
        }
}

 export const loginAnon = () => dispatch => {
     signInAnonymously(auth)
     .then((userCredential) => {
         dispatch({type: "loginAnonSuccess", payload: userCredential.user});
         dispatch(setUser());
     }).catch((error) => {
        dispatch({type: "loginAnonFail", payload: error.message});
        console.error(error.message);
        toast.error(error.message);
     });
 }

// Logout / Clear Profile
export const logout = () => async dispatch => {
    try {
        dispatch({type: "logoutRequest"});
        await signOut(auth);
        dispatch({type: "logoutSuccess"});
        dispatch({type: "clearPortfolio"});
        dispatch({type: "clearProfile"});
    } catch(err) {
        console.error(err.message);
        dispatch({type: "logoutFail", payload: err.message});
    }
}

 //Update User Email -- if user is already logged in
 export const updateUserEmail = (newEmail, cred) => async dispatch => {
    const userRef = doc(db, "users", auth.currentUser.uid);
    return reauthenticateWithCredential(auth.currentUser, cred)
     .then(() => {
        updateEmail(auth.currentUser, newEmail);
        updateDoc(userRef, {
          email: newEmail
        });
     })
     .then(() => {
         dispatch({type: "updateEmailSuccess"});
         dispatch(setUser());
     }).catch(error => {
         console.error(error.message);
         dispatch({type: "updateEmailFail"});
     })
  }

   //Update User Password -- If user is already logged in
   export const updateUserPassword = (newPassword, cred) => dispatch => {
     if (newPassword.length < 7) {
         toast.warning("Passwords must be at least 7 characters.");
     } else {
       return reauthenticateWithCredential(auth.currentUser, cred)
         .then(() => {
             updatePassword(auth.currentUser, newPassword);
         })
         .then(() => {
             dispatch({type: "updatePasswordSuccess"});
             dispatch(setUser());
         }).catch(error => {
             dispatch({type: "updatePasswordFail"});
             console.error(error.message);
         })
     }
  }

//Password reset email -- if user can't login
export const passwordResetEmail = (email) => async dispatch => {
    sendPasswordResetEmail(auth, email)
    .then(() => {
        dispatch({type: "forgotPasswordEmailSuccess"});
        toast.success(`Email successfully sent to: ${email}`);
    }).catch((error) => {
        console.error(error.message);
        dispatch({type: "forgotPasswordEmailFail", payload: error.message});
        toast.error('There was an error sending email.', error.message);
    })
};
