"use client";
import React, {useEffect, useState} from 'react';
import PriceTable from '../../components/PriceTable';
import { getHotColdCoins } from '@/store/actions/portfolioAction';
// import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from 'react-redux';
import { ArrowTrendingUpIcon, ArrowTrendingDownIcon } from '@heroicons/react/24/solid';
import TrendingSlider from '@/components/TrendingSlider';

const config = {
  headers: {
      'Access-Control-Allow-Origin': 'https://api.coingecko.com/api/v3',
  }
}
/* async function getMarketData() {
  const res = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=24h%2C7d%2C30d&locale=en&precision=2')
  return res.json()
} */

function Market() {
  const {hot7, hot30, cold7, cold30} = useSelector((state) => state.market);
  // const router = useRouter();
  const dispatch = useDispatch();
  const [coins, setCoins] = useState([]);
  
  // const market = getMarketData();
  // const [coins] = await Promise.all([market]);

  useEffect(() => {
    dispatch(getHotColdCoins());
  }, []);

  useEffect(() => {
    try {
      // console.log('before data fetch');
      fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=24h%2C7d%2C30d&locale=en&precision=2', config)
        .then((res) => res.json()) 
        .then((data) => {
           setCoins(data);
          });
      } catch(error) {
          console.log('couldnt get market data');
          console.log(error.message);
    }
    // console.log('after try catch data fetch');
  }, []);
 
    return (
    /*     <>
          <div>Price Table</div>
          {/*  <PriceTable coins={coins} />  
        </> */
               <>
               <header className="bg-white shadow">
                 <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                   <h1 className="text-3xl font-bold tracking-tight text-gray-900">Market</h1>
                 </div>
               </header>
               <main>
                 <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
                   <div className="flex flex-row xs:px-4 md:px-0">
                    <h3 className="text-lg font-bold">Trending Up</h3>
                    <ArrowTrendingUpIcon className="h-10 w-10 inline-block" />
                    </div>
                    <div className="flex flex-row mb-5 xs:px-4 md:px-0">
                     {hot7 && <TrendingSlider hot7={hot7.slice(0, 10)} /> }
                     {/*  {hot7 && hot7.slice(0, 5).map((item, index) => (
                      <div key={index} className="border border-slate-400 bg-white flex flex-row px-3 py-3 rounded-lg m-1 w-1/5">
                        <div className="flex flex-column w-1/2">
                          <div className='flex flex-row'>
                            <img className="price-table-coin-image" alt="coin-logo" src={item.image} />
                            <div>
                              <span className="text-sm font-bold">{item.name}</span>
                              <p>${item.current_price}</p>
                            </div>
                            </div>
                        {/*   <ArrowTrendingUpIcon className="h-10 w-10 inline-block" />
                        </div>
                        <div className="flex flex-column text-right justify-between w-1/2">
                          <span className="text-sm green">7d</span>
                          <span className="text-3xl green">{item.price_change_percentage_7d_in_currency.toFixed(1)}%</span>
                        </div>
                      </div>
                      ))} */}
                    </div>
                    <h3 className="text-lg font-bold mb-2">Top 100</h3>
                    {coins && coins.length > 0 ? <PriceTable coins={coins} /> : <div>no data yet</div>}
                 </div>
               </main>
             </>
    )
}

export default Market;
