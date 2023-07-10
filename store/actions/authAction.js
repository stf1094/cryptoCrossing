import {auth, db} from '../../firebaseConfig';
import {setAlert} from './alertAction';
import {
    signInWithEmailAndPassword, signOut,
    onAuthStateChanged, createUserWithEmailAndPassword,
    sendEmailVerification, updateEmail,
    updatePassword, sendPasswordResetEmail,
    deleteUser, reauthenticateWithCredential
  } from 'firebase/auth';
import { collection, doc, getDocs, addDoc, setDoc, Timestamp, updateDoc } from 'firebase/firestore';

// Register User from tutorial
 export const register = (email, password) => async dispatch => {
    console.log("inside register first part");
    if (password.length < 6) {
        //dispatch(setSignupAlert('Password must be 6 or more characters', 'warning'));
       console.log("Password must be 6 or more characters");
    } else {
        try {
            dispatch({type: "registerRequest"});
            const res = await createUserWithEmailAndPassword(auth, email, password);
            const { user } = res;
   /*          const userProfile = {
                uid: user.uid, 
                email: email
               }
            const createProfile = (userProfile) => {
                setDoc(doc(db, "users", user.uid), userProfile);
            }
            createProfile(userProfile); */
            dispatch({type: "registerSuccess", payload: user});
            dispatch(setUser());
           //  confirmEmail();
            // return userProfile;
        } catch(error) {
            const errors = error.message;
            if (errors) {
               // dispatch(setSignupAlert(errors, 'warning'));
                console.log(errors + "inside if statement");
                dispatch({type: "registerFail", payload: errors});
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

//set user (from another youtube video)
export const setUser = () => dispatch => {
    try {
        dispatch({type: "loadUserRequest"});
        onAuthStateChanged(auth, (user) => {
            if(user) {
                dispatch({type: "loadUserSuccess", payload: user})
            } else {
                dispatch({type: "loadUserFail", payload: "no user at this time"});
            }
        });
    } catch(err) {
        dispatch({type: "loadUserFail", payload: err.message});
        console.log(err.message);
    }
}

/* firebase.auth().onAuthStateChanged((authUser) => {
    if(authUser) {
      store.dispatch(setUser(authUser))
    } else {
      store.dispatch(setUser(null))
    }
  }) */

//Load user (from devConnect)
/*   export const loadUser = () => dispatch => {
    try {
        const user = auth.currentUser;
        dispatch({
            type: USER_LOADED,
            payload: user
        });
    } catch (err) {
        dispatch({
            type: AUTH_ERROR
        });
    }
}  */ 

// export const onAuthStateChanged = onAuthCallback => FirebaseAuthService.onAuthStateChanged(onAuthCallback);

export const login = (email, password) => async dispatch => {
    try {
        dispatch({type: "loginRequest"});
        await signInWithEmailAndPassword(auth, email, password)
        .then(user => {
            dispatch({type: "loginSuccess", payload: user});
            dispatch(setUser());
        }).catch(err => {
            const errors = err.message;
            if (errors) {
             // dispatch(setLoginAlert(errors, 'warning'));
              console.log(errors);
            }
           dispatch({type: "loginFail", payload: errors});
           }); 
        } catch(err) {
            // dispatch(setLoginAlert(errors, 'warning'));
            console.log(err.message);
            dispatch({type: "loginFail", payload: err.message});
        }
}

 export const loginAnon = () => dispatch => {
     auth.signInAnonymously()
     .then(() => {
         dispatch({type: "loginAnonSuccess"})
     }).catch(error => {
        dispatch({type: "loginAnonFail"})
     });
 }

// Logout / Clear Profile 
export const logout = () => async dispatch => {
    try {
        dispatch({type: "logoutRequest"});
        await signOut(auth);
        dispatch({type: "logoutSuccess"});
        dispatch({type: "clearProfile"});
        dispatch({type: "clearPortfolio"});
    } catch(err) {
        console.log(err.message);
        dispatch({type: "logoutFail", payload: err.message});
    }
}

 //Update User Email -- if user is already logged in
 export const updateUserEmail = (newEmail, cred) => async dispatch => {
    // console.log(newEmail);
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
export const passwordResetEmail = (email) => {
    sendPasswordResetEmail(auth, email)
    .then(() => {
        console.log('email sent');
    }).catch((error) => {
        console.log(error.message);
    })
};
