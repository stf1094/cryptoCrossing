import { db, auth } from "@/firebaseConfig";
import { collection, getDocs, updateDoc, addDoc, doc, deleteDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';

export const addACoin = (coin, portfolio) => async dispatch => {
    let currentCoinsArray = [];
    let match = false;
    let coinMatchToUpdateId;
    let coinMatchCurrentAmount;
    const coinsColl = collection(db, 'profiles', auth.currentUser.uid, 'coins');
    console.log(coin);
    console.log(portfolio);
    try {
       await portfolio.forEach((item) => {
            if (item.coinId === coin.coinId) {
                match = true;
                coinMatchToUpdateId = item.id;
                coinMatchCurrentAmount = Number(item.amount);
                console.log(coinMatchCurrentAmount);
            }
       });
       if (match === true) {
        console.log("its a match");
       } else {
        console.log('not a match');
       }
    } catch (err) {
        console.log(err.message);
    }
   console.log(match);
   if (match) {
    const newAmount = Number(coinMatchCurrentAmount) + Number(coin.amount);
    console.log("number: ", newAmount);
    const coinDoc = doc(db, "profiles", auth.currentUser.uid, 'coins', coinMatchToUpdateId);
    await updateDoc(coinDoc, {amount: newAmount, value: newAmount * coin.currentPrice})
        .then(() => {
            dispatch({type: "addCoinSuccess"});
            dispatch(fetchPortfolio());
            toast.success(`Updated ${coin.name} successfully to ${newAmount}.`);
        }).catch((err) => {
            console.log(err.message);
            dispatch({type: "addCoinFail"});
        });
   } else {
        await addDoc(coinsColl, coin)
        .then(() => {
            dispatch({type: "addCoinSuccess"});
            dispatch(fetchPortfolio());
            toast.success(`${coin.amount} ${coin.name} add to your portfolio!`);
        }).catch(error => {
            console.log(error.message);
            dispatch({type: "addCoinFail"});
            toast.error(`There was an error adding ${coin.amount} ${coin.name} to your portfolio. Please try again...`);
        }).then(() => {
            console.log('hey from inside false');
        }) 
   }
   
     
   /* portfolio.forEach((item) => {
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
export const deleteACoin = (id, amount, name) => dispatch => {
    const coinDoc = doc(db, "profiles", auth.currentUser.uid, 'coins', id);
    deleteDoc(coinDoc)
    .then(() => {
        dispatch({type: "deleteCoinSuccess", payload: id});
        dispatch(fetchPortfolio());
        toast.success(`${amount} ${name} deleted successfully.`);
    }).catch(error => {
        console.log(error.message);
        dispatch({type: "deleteCoinFail"});
        toast.error(`Error deleting ${name}...`);
    });
}

// fetch portfolio
export const fetchPortfolio = (userId) => dispatch => {
    const coinsColl = collection(db, 'profiles', userId, 'coins');
    getDocs(coinsColl)
       .then((snapshot) => {
           //set portfolio to dom
            dispatch({type: "fetchPortfolioSuccess", payload: snapshot.docs.map(doc => ({id: doc.id, ...doc.data()}))})
            let total = 0;
            snapshot.docs.forEach((doc) => {
                total = total + doc.data().amount * doc.data().currentPrice;
            });
           dispatch(updateTotal2(total));
        }).catch(error => {
            console.log(error.message);
            dispatch({type: "fetchPortfolioFail", payload: error.message})
        })
    }

//updateTotal
export const updateTotal = (portfolio, callback) => dispatch => {
       console.log(portfolio);
      let finaltotal;
      portfolio.forEach(function(coin) {
        finaltotal = callback(coin.coinId, coin.value);
      })
     dispatch({type: UPDATE_TOTAL_SUCCESS, payload: finaltotal})
}

export const updateTotal2 = (newTotal) => async dispatch => {
  try {
    const profileDoc = doc(db, "profiles", auth.currentUser.uid);
    await updateDoc(profileDoc, {total: newTotal});
    dispatch({type: "updateTotalSuccess", payload: newTotal})
  } catch(err) {
    console.log(err.message);
  }
}

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
      dispatch(fetchPortfolio(uid));
  }).catch(err => {
    console.log(err.message);
    dispatch({type: "updatePricesFail"});
  })
} 

export const updatePortfolioItem = (newAmount, id, name, currentPrice) => async dispatch => {
    try {
       const coinDoc = doc(db, "profiles", auth.currentUser.uid, 'coins', id);
       await updateDoc(coinDoc, {amount: newAmount, value: newAmount * currentPrice, currentPrice: currentPrice});
       dispatch({type: "updateCoinSuccess"});
       dispatch(fetchPortfolio());
       toast.success(`Updated ${name} successfully to ${newAmount}.`);
    } catch(err) {
        console.log(err.message);
        dispatch({type: "updateCoinFail"});
        toast.error(`Could not update ${name}. Please try again.`);
    }
}

export const getHotColdCoins = () => async dispatch => {
    const hot7 = [];
    const cold7 = [];
    const hot30 = [];
    const cold30 = [];
    const config = {
        headers: {
            'Access-Control-Allow-Origin': 'https://api.coingecko.com/api/v3',
        }
      }
    const res = fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=200&page=1&sparkline=false&price_change_percentage=24h%2C7d%2C30d&locale=en&precision=2', config)
    .then((res) => res.json()) 
    .then((data) => {
        data.forEach((item) => {
            //hot
            if (item.price_change_percentage_7d_in_currency > 20) {
                hot7.push(item);
            }
            if (item.price_change_percentage_30d_in_currency > 35) {
                hot30.push(item);
            }
            //cold
            if (item.price_change_percentage_7d_in_currency < -15) {
                cold7.push(item);
            }
            if (item.price_change_percentage_30d_in_currency < -30) {
                cold30.push(item);
            }
        })
        console.log("hot7", hot7);
        console.log("hot30", hot30);
        console.log("cold7", cold7);
        console.log("cold30", cold30);
    }).then(() => {
        // order hot and cold
        const orderedHot7 = hot7.sort((a,b) => 
            a.price_change_percentage_7d_in_currency > b.price_change_percentage_7d_in_currency ? -1 * 1 : 1 * 1);
        console.log("ordered Hot 7", orderedHot7);
        const orderedHot30 = hot30.sort((a,b) =>
            a.price_change_percentage_30d_in_currency > b.price_change_percentage_30d_in_currency ? -1 * 1 : 1 * 1);
        console.log("ordered Hot 30", orderedHot30);
        const orderedCold7 = cold7.sort((a,b) =>
            a.price_change_percentage_7d_in_currency > b.price_change_percentage_7d_in_currency ? -1 * 1 : 1 * 1);
        console.log("ordered Cold 7", orderedCold7);
        const orderedCold30 = cold30.sort((a,b) =>
            a.price_change_percentage_30d_in_currency > b.price_change_percentage_30d_in_currency ? -1 * 1 : 1 * 1);
        console.log("ordered Cold 30", orderedCold30);
        // push hot and cold to reducer, action, etc...
        dispatch({type: "fetchHotCoinsSuccess", payload: {orderedHot7, orderedHot30}});
        dispatch({type: "fetchColdCoinsSuccess", payload: {orderedCold7, orderedCold30}});
    }).catch((error) => {
        console.log(error.message);
        dispatch({type: "fetchHotCoinsFail", payload: error.message});
        dispatch({type: "fetchColdCoinsFail", payload: error.message});
    })
}