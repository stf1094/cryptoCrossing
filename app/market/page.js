"use client";
import React, {useEffect, useState} from 'react';
import PriceTable from '../../components/PriceTable';
import { getHotColdCoins, getMarket } from '@/store/actions/marketAction';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowTrendingUpIcon } from '@heroicons/react/24/solid';
import TrendingSlider from '@/components/TrendingSlider';

function Market() {
  const {market, market2, hot30, loading} = useSelector((state) => state.market);
  const [currentPage, setCurrentPage] = useState(1);
  const dispatch = useDispatch();

  // Fetch market data once on mount
  useEffect(() => {
    dispatch(getMarket());
    dispatch(getHotColdCoins(1));
  }, [dispatch]);

  // Determine which market data to display based on current page
  const displayedMarket = currentPage === 1 ? market : market2;

  const onPageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  const isLoading = loading || (!market && !market2);

  return (
    <>
      <header className="border-b border-ink/10 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="font-display text-3xl font-bold tracking-tight text-ink">Market</h1>
        </div>
      </header>
      <main>
        <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
          {/* Trending Section */}
          <div className="flex flex-row xs:px-4 md:px-0 mb-2">
            <h3 className="text-lg font-bold">Trending Up</h3>
            <ArrowTrendingUpIcon className="h-10 w-10 inline-block -mt-2 ml-2" />
          </div>
          <div className="flex flex-row mb-5 xs:px-4 md:px-0">
            {isLoading ? (
              <div className="text-gray-500">Loading trending coins...</div>
            ) : hot30 && hot30.length > 0 ? (
              <TrendingSlider hot7={hot30} />
            ) : (
              <div className="text-gray-500">No trending data available</div>
            )}
          </div>

          {/* Market Table Section */}
          <div className="flex flex-row items-center mb-3">
            <h3 className="text-lg font-bold mb-2 xs:px-4 md:px-0 mr-5">Top 500</h3>
            <button
              className={`mr-2 rounded-lg px-3 py-1 font-mono text-sm transition ${
                currentPage === 1
                  ? 'bg-teal font-semibold text-ink'
                  : 'bg-ink/5 text-ink/60 hover:bg-ink/10'
              }`}
              onClick={() => onPageClick(1)}
            >
              1-250
            </button>
            <button
              className={`mx-2 rounded-lg px-3 py-1 font-mono text-sm transition ${
                currentPage === 2
                  ? 'bg-teal font-semibold text-ink'
                  : 'bg-ink/5 text-ink/60 hover:bg-ink/10'
              }`}
              onClick={() => onPageClick(2)}
            >
              251-500
            </button>
          </div>

          {isLoading ? (
            <div className="text-gray-500 text-center py-10">Loading market data...</div>
          ) : displayedMarket && displayedMarket.length > 0 ? (
            <PriceTable coins={displayedMarket} />
          ) : (
            <div className="text-gray-500 text-center py-10">No market data available</div>
          )}
        </div>
      </main>
    </>
  );
}

export default Market;
