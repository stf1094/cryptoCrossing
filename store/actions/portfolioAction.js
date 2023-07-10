import { db, auth } from "@/firebaseConfig";
import { collection, getDocs, updateDoc, addDoc, doc, deleteDoc } from 'firebase/firestore';

export const addACoin = (coin, portfolio) => dispatch => {
    let currentCoinsArray = [];
    const coinsColl = collection(db, 'profiles', auth.currentUser.uid, 'coins');
   // console.log(coin);
    console.log(portfolio);
    // const res = db.collection('profiles').doc(auth.currentUser.uid).collection('coins');
    addDoc(coinsColl, coin)
    .then(() => {
        dispatch({type: "addCoinSuccess"});
        dispatch(fetchPortfolio());
    }).catch(error => {
        console.log(error.message);
        dispatch({type: "addCoinFail"});
    }).then(() => {
        console.log('hey from inside false');
    }) 
   
   
    
   /*  portfolio.forEach(function(item) {
        currentCoinsArray.push(item);
     }); 
    console.log(currentCoinsArray); */

    

     
    /*  console.log(currentCoinsArray);
     const findMatch = (value, index, array) => {
        return value === coin.coinId;
    }
     let match = currentCoinsArray.find(findMatch);
    
     console.log("the match: ", match);
 */

     

  
    

  /*   if (isMatch) {
        console.log(isMatch);
    }

    if(!isMatch) {
    res.add(coin)
    .then(() => {
        dispatch({type: ADD_COIN});
        dispatch(fetchPortfolio());
    }).catch(error => {
        console.log(error.message);
        dispatch({type: ADDCOIN_FAIL});
    }).then(() => {
        console.log('hey from inside false');
    }) 
    } */

   // if(res.includes(coin.coinId)) {
    //    console.log('includes');
   // }
        //if the new coin is already in the portfolio:
    
           // console.log('its a match: ' + coin.coinId);
           // console.log(coin.amount);
           // console.log(item.amount);
           // console.log(item.coinId);
   /*          const newAmount = Number(coin.amount) + Number(item.amount);
            console.log(newAmount);
            res.doc(item.id).update({amount: newAmount, value: newAmount*item.currentPrice})
                .then(() => {
                  //  console.log(index);
                    dispatch({type: ADD_COIN});
                    dispatch(fetchPortfolio());
                }).catch(error => {
                    console.log(error.message);
                    dispatch({type: ADDCOIN_FAIL});
                }).then(() => {
                    console.log('hey from inside add coin for a matching coin');
            }) */
        

 /* portfolio.forEach(function(item, index) {
    switch (coin.coinId, item.coinId) {
        case (coin.coinId === item.coinId):
          console.log('match');
        break;
        case (coin.coinId !== item.coinId):
            console.log('no match');
        break;
        default:
            console.log('default');
    }
}); */
   /*  portfolio.every((item, index) => {
        if (coin.coinId !== item.coinId) {
            res.add(coin)
                .then(() => {
                    dispatch({type: ADD_COIN});
                    dispatch(fetchPortfolio());
                }).catch(error => {
                    console.log(error.message);
                    dispatch({type: ADDCOIN_FAIL});
                }).then(() => {
                    console.log('hey from inside 2nd part of loop');
                }) 
                return;
        } else {
            console.log('match');
        }
    }) */

     /*    else if (coin.coinId !== item.coinId) {
            console.log(portfolio[index]);
            console.log(index);
            console.log(item.coinId);
            res.add(coin)
                .then(() => {
                    dispatch({type: ADD_COIN});
                    dispatch(fetchPortfolio());
                }).catch(error => {
                    console.log(error.message);
                    dispatch({type: ADDCOIN_FAIL});
                }).then(() => {
                    console.log('hey from inside 2nd part of loop');
                }) 
                
        }  */ 
        /* else if(coin.coinId !== item.coinId) {
            console.log(index);
        } */

 /*        res.add(coin)
        .then(() => {
            dispatch({type: ADD_COIN});
            dispatch(fetchPortfolio());
        }).catch(error => {
            console.log(error.message);
            dispatch({type: ADDCOIN_FAIL});
        }).then(() => {
            console.log('hey from inside add coin')
        })  */
     //end first loop



};

//delete a coin
export const deleteACoin = (id) => dispatch => {
    const coinDoc = doc(db, "profiles", auth.currentUser.uid, 'coins', id);
    // db.collection('profiles').doc(auth.currentUser.uid).collection('coins').doc(id).delete()
    deleteDoc(coinDoc)
    .then(() => {
        dispatch({type: "deleteCoinSuccess", payload: id});
        dispatch(fetchPortfolio());
    }).catch(error => {
        console.log(error.message);
        dispatch({type: "deleteCoinFail"})
    });
}

// fetch portfolio
export const fetchPortfolio = () => dispatch => {
    // console.log(auth.currentUser.uid);
    const coinsColl = collection(db, 'profiles', auth.currentUser.uid, 'coins');
    getDocs(coinsColl)
       .then((snapshot) => {
           //set portfolio to dom
            dispatch({type: "fetchPortfolioSuccess", payload: snapshot.docs.map(doc => ({id: doc.id, ...doc.data()}))})
            //console.log(snapshot.docs.map(doc => ({id: doc.id, ...doc.data()})));
            let total = 0;
            snapshot.docs.forEach(function(doc) {
               // console.log(doc.data());
               // console.log(doc.data().currentPrice);
                total = total + doc.data().amount * doc.data().currentPrice;
                //console.log(total);
            });
           // dispatch(updateTotal(port, callback));
           dispatch(updateTotal2(total));
           //dispatch(fetchTotal())
        }).catch(error => {
            console.log(error.message);
            dispatch({type: PORTFOLIO_FAIL, payload: error.message})
        })
    }

//updateTotal
export const updateTotal = (portfolio, callback) => dispatch => {
       console.log(portfolio);
     // console.log(coinOptions);
      let finaltotal;
      portfolio.forEach(function(coin) {
        finaltotal = callback(coin.coinId, coin.value);
      })
     // console.log(finaltotal);
      //console.log(total);
     dispatch({type: UPDATE_TOTAL_SUCCESS, payload: finaltotal})
}

export const updateTotal2 = (newTotal) => async dispatch => {
  console.log(newTotal, "inside updateTotal2");
  try {
    const profileDoc = doc(db, "profiles", auth.currentUser.uid);
    await updateDoc(profileDoc, {total: newTotal});
    dispatch({type: "updateTotalSuccess", payload: newTotal})
  } catch(err) {
    console.log(err.message);
  }
}

 export const updatePrices = (options) => dispatch => {
 // console.log(options);
  const coinsColl = collection(db, 'profiles', auth.currentUser.uid, 'coins');
 // const res = db.collection('profiles').doc(auth.currentUser.uid).collection('coins').get()
  getDocs(coinsColl)
    .then((snapshot) => {
      snapshot.docs.forEach(function(coindoc) {
         // console.log(coindoc.data());
          options.forEach(function(option) {
              if(coindoc.data().coinId === option.id) {
                /* console.log(coindoc.data().coinId);
                console.log(option.current_price);
                console.log(coindoc.id);
                console.log(coindoc.data().amount); */
                const coinDocToUpdate = doc(db, 'profiles', auth.currentUser.uid, 'coins', coindoc.id);
               // db.collection('profiles').doc(auth.currentUser.uid).collection('coins').doc(doc.id).update({currentPrice: option.current_price, value: option.current_price * doc.data().amount})
                updateDoc(coinDocToUpdate, {currentPrice: option.current_price, value: option.current_price * coindoc.data().amount});
              }
          })
      })
  }).then(() => {
      dispatch({type: "updatePricesSuccess"});
      dispatch(fetchPortfolio())
  }).catch(err => {
    console.log(err.message);
    dispatch({type: "updatePricesFail"});
  })
} 

export const fetchTotal = () => dispatch => {
   db.collection('profiles').doc(auth.currentUser.uid).get()
   .then(doc => {
       dispatch({type: FETCH_TOTAL, payload: doc.data().total})
       console.log(doc.data().total);
   })
   //console.log(res);
}

export const updatePortfolioItem = (newAmount, id) => async dispatch => {
    try {
       const coinDoc = doc(db, "profiles", auth.currentUser.uid, 'coins', id);
       await updateDoc(coinDoc, {amount: newAmount});
       dispatch({type: "updateCoinSuccess"});
       dispatch(fetchPortfolio());
    } catch(err) {
        console.log(err.message);
        dispatch({type: "updateCoinFail"});
    }
}

export const getHotColdCoins = () => async dispatch => {
    const hotCoins = [];
    const buyDip = [];
    const res = fetch('url')
    .then((res) => res.json()) 
    .then((data) => {
        data.forEach((item) => {
            //hot
            if (item.change > 15 || item.change > 20 ) {
                hotCoins.push({item});
            }
            //cold
            if (cold) {
                buyDip.push(item);
            }
        })
    }).then(() => {
        // push hot and cold to reducer, action, etc...
    })
}