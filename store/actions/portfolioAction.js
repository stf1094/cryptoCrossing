import { db, auth } from "../../firebaseConfig";
import { collection, getDocs, updateDoc, setDoc, addDoc, doc, deleteDoc, query, orderBy } from 'firebase/firestore';
import { toast } from 'react-toastify';

// Portfolio actions — CRUD over the signed-in user's coin holdings, stored as a
// `coins` subcollection under profiles/{uid} in Firestore, plus the running
// portfolio total. All of these require an authenticated user. Market-data
// fetching lives in marketAction.js.

// addACoin — adds a coin to the portfolio. If the user already holds that coin
// its amount is summed onto the existing doc and the value recomputed; otherwise
// a new coin doc is created. Refreshes the portfolio from Firestore on success.
export const addACoin = (coin, portfolio) => async dispatch => {
    let currentCoinsArray = [];
    let match = false;
    let coinMatchToUpdateId;
    let coinMatchCurrentAmount;
    const coinsColl = collection(db, 'profiles', auth.currentUser.uid, 'coins');
    try {
       await portfolio.forEach((item) => {
            if (item.coinId === coin.coinId) {
                match = true;
                coinMatchToUpdateId = item.id;
                coinMatchCurrentAmount = Number(item.amount);
            }
       });
    } catch (err) {
        console.error(err.message);
    }
   if (match) {
    const newAmount = Number(coinMatchCurrentAmount) + Number(coin.amount);
    const coinDoc = doc(db, "profiles", auth.currentUser.uid, 'coins', coinMatchToUpdateId);
    await updateDoc(coinDoc, {amount: newAmount, value: newAmount * coin.currentPrice})
        .then(() => {
            dispatch({type: "addCoinSuccess"});
            dispatch(fetchPortfolio(auth.currentUser.uid));
            toast.success(`Updated ${coin.name} successfully to ${newAmount}.`);
        }).catch((err) => {
            console.error(err.message);
            dispatch({type: "addCoinFail"});
        });
   } else {
        await addDoc(coinsColl, coin)
        .then(() => {
            dispatch({type: "addCoinSuccess"});
            dispatch(fetchPortfolio(auth.currentUser.uid));
            toast.success(`${coin.amount} ${coin.name} add to your portfolio!`);
        }).catch((error) => {
            console.error(error.message);
            dispatch({type: "addCoinFail"});
            toast.error(error.message)
            toast.error(`There was an error adding ${coin.amount} ${coin.name} to your portfolio. Please try again...`);
        });
   }
};

// deleteACoin — removes a single coin doc from the user's holdings by id and
// refreshes the portfolio. amount/name are used only for the toast message.
export const deleteACoin = (id, amount, name) => dispatch => {
    const coinDoc = doc(db, "profiles", auth.currentUser.uid, 'coins', id);
    deleteDoc(coinDoc)
    .then(() => {
        dispatch({type: "deleteCoinSuccess", payload: id});
        dispatch(fetchPortfolio(auth.currentUser.uid));
        toast.success(`${amount} ${name} deleted successfully.`);
    }).catch(error => {
        console.error(error.message);
        dispatch({type: "deleteCoinFail"});
        toast.error(`Error deleting ${name}...`);
    });
}

// fetchPortfolio — loads all of the user's coins (ordered by value desc) into
// the store, then sums them into the portfolio total via updateTotal2. Pass
// setLoading truthy to flip the loading flag first; skips entirely without a uid.
export const fetchPortfolio = (userId, setLoading) => dispatch => {
    if (!userId) {
        console.warn('fetchPortfolio called without a userId; skipping.');
        return;
    }
    const coinsColl = collection(db, 'profiles', userId, 'coins');
    const q = query(coinsColl, orderBy("value", "desc"));
    setLoading && dispatch({type: "fetchPortfolioRequest"});
    getDocs(q)
       .then((snapshot) => {
           //set portfolio to dom
            dispatch({type: "fetchPortfolioSuccess", payload: snapshot.docs.map(doc => ({id: doc.id, ...doc.data()}))})
            let total = 0;
            snapshot.docs.forEach((doc) => {
                total = total + doc.data().amount * doc.data().currentPrice;
            });
           dispatch(updateTotal2(total));
        }).catch(error => {
            console.error(error.message);
            dispatch({type: "fetchPortfolioFail", payload: error.message})
        })
    }

// updateTotal — LEGACY / UNUSED. Reduces the portfolio to a total via a caller
// supplied callback. Not referenced anywhere in the app and references an
// undefined `UPDATE_TOTAL_SUCCESS` constant, so it would throw if ever called.
// Kept only for reference; safe to delete. updateTotal2 is the live version.
export const updateTotal = (portfolio, callback) => dispatch => {
      let finaltotal;
      portfolio.forEach(function(coin) {
        finaltotal = callback(coin.coinId, coin.value);
      })
     dispatch({type: UPDATE_TOTAL_SUCCESS, payload: finaltotal})
}

// updateTotal2 — persists the freshly computed portfolio total onto the user's
// profile doc (upserted with merge so first-time/anonymous users get a profile
// created rather than an error) and mirrors it into the store. Called by
// fetchPortfolio after loading holdings.
export const updateTotal2 = (newTotal) => async dispatch => {
  try {
    const { uid, email } = auth.currentUser;
    const profileDoc = doc(db, "profiles", uid);
    // merge so a first-time / anonymous user without a profile doc gets one
    // created instead of throwing "No document to update".
    await setDoc(profileDoc, { uid, email: email ?? null, total: newTotal }, { merge: true });
    dispatch({type: "updateTotalSuccess", payload: newTotal})
  } catch(err) {
    console.error(err.message);
  }
}

// updatePrices — refreshes stored prices/values for every coin the user holds.
// `options` is a list of live market coins (id + current_price); each holding is
// matched by coinId and its currentPrice/value written back to Firestore, then
// the portfolio is re-fetched. Used to keep holdings in sync with the market.
 export const updatePrices = (options, uid) => dispatch => {
  const coinsColl = collection(db, 'profiles', uid, 'coins');
  getDocs(coinsColl)
    .then((snapshot) => {
      snapshot.docs.forEach(function(coindoc) {
          options.forEach(function(option) {
              if(coindoc.data().coinId === option.id) {
                const coinDocToUpdate = doc(db, 'profiles', uid, 'coins', coindoc.id);
                updateDoc(coinDocToUpdate, {currentPrice: option.current_price, value: option.current_price * coindoc.data().amount});
              }
          })
      })
  }).then(() => {
      dispatch({type: "updatePricesSuccess"});
      dispatch(fetchPortfolio(uid, false));
  }).catch(err => {
    console.error(err.message);
    dispatch({type: "updatePricesFail"});
  })
}

// updatePortfolioItem — overwrites a single holding's amount (and recomputes its
// value from the given price) directly, e.g. from the edit-coin modal. Unlike
// addACoin this replaces the amount rather than adding to it.
export const updatePortfolioItem = (newAmount, id, name, currentPrice) => async dispatch => {
    try {
       const coinDoc = doc(db, "profiles", auth.currentUser.uid, 'coins', id);
       await updateDoc(coinDoc, {amount: newAmount, value: newAmount * currentPrice, currentPrice: currentPrice});
       dispatch({type: "updateCoinSuccess"});
       dispatch(fetchPortfolio(auth.currentUser.uid));
       toast.success(`Updated ${name} successfully to ${newAmount}.`);
    } catch(err) {
        console.error(err.message);
        dispatch({type: "updateCoinFail"});
        toast.error(`Could not update ${name}. Please try again.`);
    }
}
