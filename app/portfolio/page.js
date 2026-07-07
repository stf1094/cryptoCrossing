"use client";
import React, {useEffect, useState, useRef} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from "next/navigation";
import { fetchPortfolio, updatePrices } from '../../store/actions/portfolioAction';
import Results from '../../components/Results';
import UpdateCoinModal from '../../components/UpdateCoinModal';
import { ArrowPathRoundedSquareIcon, PlusCircleIcon } from '@heroicons/react/24/outline';
import useSWR from 'swr';
import AddCoinSlideover from '@/components/AddCoinSlideover';
import LoadingState from '@/components/LoadingState';

// Create a component for the empty state
function EmptyPortfolio({ openAddCoinSlide }) {
  return (
    <div className="flex flex-col items-center justify-center h-96 text-center">
      <h2 className="font-display text-5xl font-bold text-ink">Start building your<br />portfolio today</h2>
      <p className="mt-4 text-ink/60">Add the coins you already hold and watch their value move together.</p>
      <button
        onClick={openAddCoinSlide}
        className="mt-8 rounded-xl bg-teal py-3 px-8 font-semibold text-ink transition-colors hover:bg-teal-600"
      >
        Add your first coin
      </button>
    </div>
  );
}

const options = {
    method: "GET",
    headers: {
        'Access-Control-Allow-Origin': '*',
        // 'x-cg-demo-api-key': process.env.NEXT_PUBLIC_CG_API
    },
}
const fetcher = (url) => fetch(url, options).then((res) => res.json());
const API = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&page=1&sparkline=false';

const Portfolio = () => {
    const router = useRouter();
    const { data, error } = useSWR(API, fetcher);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [modalCoin, setModalCoin] = useState(null);
    const [modalAmount, setModalAmount] = useState(0);
    const [modalCoinId, setModalCoinId] = useState('');
    const [showAddCoinSlide, setShowAddCoinSlide] = useState(false);
    const {portfolio, loading, total} = useSelector((state) => state.portfolio);
    const { user, isAuthenticated } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const hasUpdatedPricesRef = useRef(false);

    // More accurate loading state: loading if either API data or portfolio is loading
    const isLoading = loading || (!data && !error);

    const openUpdateModal = () => {
        setShowUpdateModal(prev => !prev);
    };

    const openAddCoinSlide = () => {
        setShowAddCoinSlide(prev => !prev);
    }

    // Handle authentication redirect
    useEffect(() => {
        if (!isAuthenticated) {
          router.push('/login');
        }
    }, [isAuthenticated, router]);

    // Fetch portfolio data when user is authenticated
    useEffect(() => {
        if (user && isAuthenticated) {
          dispatch(fetchPortfolio(user.uid, true));
        }
    }, [user, isAuthenticated, dispatch]);

    // Update prices on initial load when both portfolio and market data are available
    useEffect(() => {
        if (user && isAuthenticated && data && portfolio && portfolio.length > 0 && !hasUpdatedPricesRef.current) {
          hasUpdatedPricesRef.current = true;
          dispatch(updatePrices(data, user.uid));
        }
    }, [data, portfolio, user, isAuthenticated, dispatch]); 

    const onUpdatePrices = () => {
        if (user && isAuthenticated && data) {
        dispatch(updatePrices(data, user.uid));
    }
    }
    if (!isAuthenticated) return null; // Early return while redirecting

return (
  <>
    <header className="border-b border-ink/10 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 flex-row justify-between">
           <h1 className="font-display text-3xl font-bold tracking-tight text-ink">Portfolio</h1>
           <div className="flex-row">
             <PlusCircleIcon className="h-10 w-10 hover:cursor-pointer hover:text-teal mr-3" aria-hidden="true" onClick={openAddCoinSlide} />
             <ArrowPathRoundedSquareIcon className="h-10 w-10 hover:cursor-pointer hover:text-teal" aria-hidden="true" onClick={onUpdatePrices} />
           </div>
        </div>
    </header>
    <main>
        <div className="mx-auto max-w-7xl py-6 xs:px-8 sm:px-6 lg:px-8">
            <UpdateCoinModal showUpdateModal={showUpdateModal} setShowUpdateModal={setShowUpdateModal} coinOptions={data} modalCoinId={modalCoinId} modalCoin={modalCoin} modalAmount={modalAmount} />
            <AddCoinSlideover showAddCoinSlide={showAddCoinSlide} setShowAddCoinSlide={setShowAddCoinSlide} coinsList={data} />

          {/* Show loading state while fetching data */}
          {isLoading && <LoadingState />}

          {/* Show portfolio when data is loaded and portfolio exists */}
          {!isLoading && portfolio && portfolio.length > 0 && (
            <div className="dashboard">
                <div className="dashboard-header">
                    <div className="portfolio-title-group">

                    </div>
                    <span className="dashboard-total mr-1">${total?.toFixed(2) ?? "0"}</span>
                </div>
                <Results
                    openUpdateModal={openUpdateModal}
                    setModalAmount={setModalAmount}
                    setModalCoinId={setModalCoinId}
                    setModalCoin={setModalCoin}
                    overallTotal={total}
                />
            </div>
          )}

          {/* Show empty state when not loading and portfolio is empty */}
          {!isLoading && (!portfolio || portfolio.length === 0) && (
            <EmptyPortfolio openAddCoinSlide={openAddCoinSlide} />
          )}
        </div>
    </main>
</>
)}

export default Portfolio;