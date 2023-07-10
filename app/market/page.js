"use client";
import React, {useEffect, useState} from 'react';
import PriceTable from '../../components/PriceTable';
// import { useRouter } from "next/navigation";
// import { useSelector, useDispatch } from 'react-redux';

const config = {
  headers: {
      'Access-Control-Allow-Origin': 'https://api.coingecko.com/api/',
  }
}
/* async function getMarketData() {
  const res = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=24h%2C7d%2C30d&locale=en&precision=2')
  return res.json()
} */

function Market() {
  // const router = useRouter();
  // const dispatch = useDispatch();
  const [coins, setCoins] = useState([]);
  // const market = getMarketData();
  // const [coins] = await Promise.all([market]);
  useEffect(() => {
    try {
      console.log('before data fetch');
      fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=24h%2C7d%2C30d&locale=en&precision=2', config)
        .then((res) => res.json()) 
        .then((data) => {
           setCoins(data);
      })
    } catch(error) {
      console.log('couldnt get market data');
      console.log(error.message);
    }
    console.log('after try catch data fetch');
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
                    {coins && coins.length > 0 ? <PriceTable coins={coins} /> : <div>no data yet</div>}
                 </div>
               </main>
             </>
    )
}

export default Market;
