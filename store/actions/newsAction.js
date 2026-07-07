import { db } from "@/firebaseConfig";
import { collection, getDocs } from 'firebase/firestore';

//fetch general news
export const fetchNews = () => dispatch => {
    dispatch({type: "fetchGeneralNewsRequest"});
    const newsColl = collection(db, "news", "general", "generalNews");
    getDocs(newsColl)
       .then(snapshot => {
           //set news to DOM, state
            dispatch({type: "fetchGeneralNewsSuccess", payload: snapshot.docs.map(doc => ({id: doc.id, ...doc.data()}))})
        }).catch(error => {
            console.error(error.message);
            dispatch({type: "fetchGeneralNewsFail", payload: error.message})
        })
}

export const fetchBitcoinNews = () => dispatch => {
    dispatch({type: "fetchBTCNewsRequest"});
    const btcNewsColl = collection(db, "news", "bitcoin", "bitcoinNews");
    getDocs(btcNewsColl)
       .then(snapshot => {
           //set news to DOM, state
            dispatch({type: "fetchBTCNewsSuccess", payload: snapshot.docs.map(doc => ({id: doc.id, ...doc.data()}))})
        }).catch(error => {
            console.error(error.message);
            dispatch({type: "fetchBTCNewsFail", payload: error.message})
        })
}

export const fetchAltsNews = () => dispatch => {
    dispatch({type: "fetchAltsNewsRequest"});
    const altsNewsColl = collection(db, "news", "alts", "altsNews");
    getDocs(altsNewsColl)
       .then(snapshot => {
           //set news to DOM, state
            dispatch({type: "fetchAltsNewsSuccess", payload: snapshot.docs.map(doc => ({id: doc.id, ...doc.data()}))})
        }).catch(error => {
            console.error(error.message);
            dispatch({type: "fetchAltsNewsFail", payload: error.message})
        })
} 