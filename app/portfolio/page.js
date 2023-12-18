"use client";
import React, {useEffect, useState, Suspense} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from "next/navigation";
import { fetchPortfolio, updatePrices } from '../../store/actions/portfolioAction';
// import { getCurrentProfile } from '../../store/actions/profileAction';
import Results from '../../components/Results';
import UpdateCoinModal from '../../components/UpdateCoinModal';
import { ArrowPathRoundedSquareIcon, PlusCircleIcon } from '@heroicons/react/24/outline';
// import { setUser } from '@/store/actions/authAction';
import useSWR from 'swr';
import AddCoinSlideover from '@/components/AddCoinSlideover';

const options = {
    method: "GET",
    headers: {
        'Access-Control-Allow-Origin': 'https://api.coingecko.com/api/v3',
    },
}
const fetcher = (url) => fetch(url, options).then((res) => res.json());
const API = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=200&page=1&sparkline=false';

const Portfolio = () => {
    const router = useRouter();
    const { data, error } = useSWR(API, fetcher);
    // const [coinOptions, setCoinOptions] = useState([]);
    const [list, setList] = useState([]);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [modalCoin, setModalCoin] = useState(null);
    const [modalAmount, setModalAmount] = useState(0);
    const [modalCoinId, setModalCoinId] = useState('');
    const [showAddCoinModal, setShowAddCoinModal] = useState(false);
    const [showAddCoinSlide, setShowAddCoinSlide] = useState(false);
    const {portfolio, total} = useSelector((state) => state.portfolio);
    const { user, isAuthenticated } = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    const openUpdateModal = () => {
        setShowUpdateModal(prev => !prev);
       // setModalAmount(amount);
       // setModalCoin(coin);
      };
  
    const openAddCoinModal = () => {
          setShowAddCoinModal(prev => !prev);
          console.log('clicked');
    }
    const openAddCoinSlide = () => {
        setShowAddCoinSlide(prev => !prev);
        console.log('clicked');
    }
    useEffect(() => {
        if (!isAuthenticated) {
          console.log("user not authenticated to view this page...");
          router.push('/login');
        }
    }, []);

    useEffect(() => {
        if (user && isAuthenticated) {
          dispatch(fetchPortfolio(user.uid));
          dispatch(updatePrices(data, user.uid));
        }
        console.log('hey from inside fetchPOrtfolio/update prices inside Dash');
    }, []); 

    const onUpdatePrices = () => {
        if (user && isAuthenticated && data) {
        console.log('on update prices');
        dispatch(updatePrices(data, user.uid));
    }
    }

return (
  <>
    <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 flex-row justify-between">
           <h1 className="text-3xl font-bold tracking-tight text-gray-900">Portfolio</h1>
           <div className="flex-row">
             <PlusCircleIcon className="h-10 w-10 hover:cursor-pointer hover:text-sky-300 mr-3" aria-hidden="true" onClick={openAddCoinSlide} />
             <ArrowPathRoundedSquareIcon className="h-10 w-10 hover:cursor-pointer hover:text-sky-300" aria-hidden="true" onClick={onUpdatePrices} />
           </div>
        </div>
    </header>
    <main>
        <div className="mx-auto max-w-7xl py-6 xs:px-8 sm:px-6 lg:px-8"> 
            <Suspense fallback={<div>Loading...</div>}>
              <UpdateCoinModal showUpdateModal={showUpdateModal} setShowUpdateModal={setShowUpdateModal} coinOptions={data} modalCoinId={modalCoinId} modalCoin={modalCoin} modalAmount={modalAmount} />
              <AddCoinSlideover showAddCoinSlide={showAddCoinSlide} setShowAddCoinSlide={setShowAddCoinSlide} coinsList={data} />
            </Suspense>
            {portfolio && portfolio.length > 0 ? (

            
            <div className="dashboard">
                <div className="dashboard-header">
                    <div className="portfolio-title-group">
                     {/*  <PlusCircleIcon className="h-10 w-10 hover:cursor-pointer hover:text-sky-300 mr-3" aria-hidden="true" onClick={openAddCoinSlide} />
                      <ArrowPathRoundedSquareIcon className="h-10 w-10 hover:cursor-pointer hover:text-sky-300" aria-hidden="true" onClick={onUpdatePrices} /> */}
                    </div>
                    <span className="dashboard-total mr-1">${total ? total.toFixed(2) : "0"}</span> 
                </div>
                <Results 
                    openUpdateModal={openUpdateModal} 
                    // openAddCoinModal={openAddCoinModal} 
                    setModalAmount={setModalAmount} 
                    setModalCoinId={setModalCoinId} 
                    setModalCoin={setModalCoin} 
                    overallTotal={total} 
                    //list={list} 
                />
            </div>
            ) : (
                <div className="flex flex-column items-center text-center justify-center align-center h-96">
                  <h2 className="text-5xl">Start creating your<br></br> portfolio today!</h2>
                  <button onClick={openAddCoinSlide} className="mt-10 bg-sky-400 py-3 px-8 text-white hover:bg-sky-300 hover:cursor-pointer rounded-xl"> Get started </button>
                </div>
            ) /* : (
              <div className="flex flex-column items-center text-center justify-center align-center h-96">
                 <div>loading...</div>
              </div>
            ) */
        }
        </div>
    </main>
</>
// )
)}

export default Portfolio;