"use client";
import React, {useEffect, useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addACoin, fetchPortfolio, updateTotal, updateTotal2, fetchTotal, updatePrices } from '../../store/actions/portfolioAction';
// import { getCurrentProfile } from '../../store/actions/profileAction';
import AddCoinModal from '../../components/AddCoinModal';
import Results from '../../components/Results';
import UpdateCoinModal from '../../components/UpdateCoinModal';
import { ArrowPathRoundedSquareIcon, PlusCircleIcon } from '@heroicons/react/24/outline';
import { setUser } from '@/store/actions/authAction';

const Dashboard = () => {
    const [coinOptions, setCoinOptions] = useState([]);
    const [list, setList] = useState([]);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [modalCoin, setModalCoin] = useState(null);
    const [modalAmount, setModalAmount] = useState(0);
    const [modalCoinId, setModalCoinId] = useState('');
    const [showAddCoinModal, setShowAddCoinModal] = useState(false);
    const {portfolio, total} = useSelector((state) => state.portfolio);
    const { user} = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    
   /*  useEffect(() => {
        dispatch(setUser());
        console.log("set user inside dashboard");
    }, []); */

    const openUpdateModal = () => {
        setShowUpdateModal(prev => !prev);
       // setModalAmount(amount);
       // setModalCoin(coin);
      };
  
    const openAddCoinModal = () => {
          setShowAddCoinModal(prev => !prev);
          console.log('clicked');
    }
    React.useEffect(() => {
        fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false')
            .then((res) => res.json()) 
            .then((data) => {
           // console.log(data);
               // setCoins(data);
                setCoinOptions(data);
            })
    }, []);

    useEffect(() => {
        if (user) {
          dispatch(fetchPortfolio());
        }
        console.log('hey from inside fetchPOrtfolio inside Dash');
    }, []); 

    const onUpdatePrices = () => {
        console.log('on update prices');
        dispatch(updatePrices(coinOptions));
    }

    const handleSeeValue = async (value, index) => {
        console.log(value);
        // console.log(select);
        // console.log(index.id);
        // console.log(coinOptions[index].id);
        // const total = value * select;
        const total = value * coinOptions[index].current_price;
        const coinName = coinOptions[index].name;
        const symbol = coinOptions[index].symbol;
        const img = coinOptions[index].image;
        const newPriceSub = {
          coinTotal: total,
          name: coinName,
        }
        const newCoin = {
            amount: value,
            name: coinName,
            coinId: coinOptions[index].id,
        // currentPrice: select,
            currentPrice: coinOptions[index].current_price,
            value: value * coinOptions[index].current_price,
            symbol: symbol,
            img: img
        }
        setList([...list, newPriceSub]);
        dispatch(addACoin(newCoin, portfolio));
    }
return (
  <>
  <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Portfolio</h1>
        </div>
  </header>
  <main>
    <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8"> 
    <UpdateCoinModal showUpdateModal={showUpdateModal} setShowUpdateModal={setShowUpdateModal} modalCoinId={modalCoinId} modalCoin={modalCoin} modalAmount={modalAmount} />
    <AddCoinModal showAddCoinModal={showAddCoinModal} setShowAddCoinModal={setShowAddCoinModal} coinsList={coinOptions} seeValue={handleSeeValue} />
    <div className="dashboard">
        <div className="dashboard-header">
            <div className="portfolio-title-group">
               <PlusCircleIcon className="h-10 w-10 hover:cursor-pointer hover:text-sky-300 mr-3" aria-hidden="true" onClick={openAddCoinModal} />
               <ArrowPathRoundedSquareIcon className="h-10 w-10 hover:cursor-pointer hover:text-sky-300" aria-hidden="true" onClick={onUpdatePrices} />
              {/*  <span onClick={openAddCoinModal} className="material-icons mr-h mat-btn">add_circle_outline</span>
               <span onClick={onUpdatePrices} className="material-icons mat-btn">refresh</span> */}
            </div>
             <span className="dashboard-total">${total ? total.toFixed(2) : "0"}</span> 
        </div>
   {/*  <Inputs coinsList={coinOptions} seeValue={handleSeeValue} /> */}
    <Results 
      openUpdateModal={openUpdateModal} 
      openAddCoinModal={openAddCoinModal} 
      setModalAmount={setModalAmount} 
      setModalCoinId={setModalCoinId} 
      setModalCoin={setModalCoin} 
      overallTotal={total} 
      list={list} />
   {/*  <div className="my-2">
        <button className="btn btn-danger">
            Delete My Account
        </button>
    </div> */}

    </div>
    </div>
    </main>
    </>
// )
)}

export default Dashboard;