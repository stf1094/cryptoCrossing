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
import { collection, doc, getDocs, addDoc, setDoc, Timestamp, updateDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';

// Register User from tutorial
 export const register = (email, password) => async dispatch => {
    console.log("inside register first part");
    if (password.length < 7) {
        toast.warning("Passwords must be at least 7 characters.")
        //dispatch(setSignupAlert('Password must be 6 or more characters', 'warning'));
       console.log("Password must be 6 or more characters");
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
           //  confirmEmail();
            // return userProfile;
        } catch(error) {
            const errors = error.message;
            if (errors) {
                console.log(errors);
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

//Delete account -- prob need to add deleting portfolio too...
export const deleteAccount = () => dispatch => {
    console.log(auth.currentUser.uid);
    db.collection('profiles').doc(auth.currentUser.uid).delete()
    .then(() => {
         auth.currentUser.delete();
         dispatch({type: "clearPortfolio"});
         dispatch({type: "clearProfile"});
         dispatch({type: "logout"});
    }).catch(err => {
        console.log(err.message);
    })
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
        console.log(err.message);
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
            console.log(errors);
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
            console.log(err.message);
            dispatch({type: "loginFail", payload: err.message});
            toast(err.message);
        }
}

 export const loginAnon = () => dispatch => {
     signInAnonymously(auth)
     .then((user) => {
         dispatch({type: "loginAnonSuccess", payload: user});
         dispatch(setUser());
     }).catch((error) => {
        dispatch({type: "loginAnonFail", payload: error.message});
        console.log(error.message);
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
        console.log(err.message);
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
         console.log(error.message);
         dispatch({type: "updateEmailFail"});
     })
  }
 
   //Update User Password -- If user is already logged in
   export const updateUserPassword = (newPassword, cred) => dispatch => {
     if (newPassword.length < 6) {
         Alert.alert('Password must be 6 or more characters');
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
             console.log(error.message);
         })
     }
  }

//Password reset email -- if user can't login
export const passwordResetEmail = (email) => async dispatch => {
    console.log(email);
    sendPasswordResetEmail(auth, email)
    .then(() => {
        console.log('email sent');
        dispatch({type: "forgotPasswordEmailSuccess"});
        toast.success(`Email successfully sent to: ${email}`);
    }).catch((error) => {
        console.log(error.message);
        dispatch({type: "forgotPasswordEmailFail", payload: error.message});
        toast.error('There was an error sending email.', error.message);
    })
};
