"use client";
import React, {Suspense, useEffect} from 'react';
import PriceTable from '../../components/PriceTable';
import { getHotColdCoins } from '@/store/actions/portfolioAction';
// import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from 'react-redux';
import { ArrowTrendingUpIcon, ArrowTrendingDownIcon } from '@heroicons/react/24/solid';
import TrendingSlider from '@/components/TrendingSlider';
// import { toast } from 'react-toastify';
import useSWR from 'swr';

const config = {
  headers: {
      'Access-Control-Allow-Origin': 'https://api.coingecko.com/api/v3',
  }
}

const fetcher = (url) => fetch(url).then((res) => res.json());
const API = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=24h%2C7d%2C30d&locale=en&precision=2";

function Market() {
  const { data, error } = useSWR(API, fetcher);
  const {hot7, hot30, cold7, cold30} = useSelector((state) => state.market);
  // const router = useRouter();
  const dispatch = useDispatch();
  // const [coins, setCoins] = useState([]);
  
  // const market = getMarketData();
  // const [coins] = await Promise.all([market]);

  useEffect(() => {
    dispatch(getHotColdCoins());
  }, []);
/* 
  useEffect(() => {
    try {
      // console.log('before data fetch');
      fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=24h%2C7d%2C30d&locale=en&precision=2', config)
        .then((res) => res.json()) 
        .then((data) => {
           setCoins(data);
          });
      } catch(error) {
          toast.error(error.message);
          toast.error('Could not fetch market data...');
          console.log('couldnt get market data');
          console.log(error.message);
    }
    // console.log('after try catch data fetch');
  }, []); */
  console.log("Is data ready?", !!data);
    return (
            <>
               <header className="bg-white shadow">
                 <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                   <h1 className="text-3xl font-bold tracking-tight text-gray-900">Market</h1>
                 </div>
               </header>
               <main>
                 <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
                    <div className="flex flex-row xs:px-4 md:px-0 mb-2">
                       <h3 className="text-lg font-bold">Trending Up</h3>
                       <ArrowTrendingUpIcon className="h-10 w-10 inline-block -mt-2 ml-2" />
                    </div>
                    <div className="flex flex-row mb-5 xs:px-4 md:px-0">
                      {hot7 && <TrendingSlider hot7={hot7.slice(0, 10)} /> } 
                    </div>
                    <h3 className="text-lg font-bold mb-2">Top 100</h3>
                    <Suspense fallback={<div>Loading...</div>}>
                       {data && data.length > 0 ? <PriceTable coins={data} /> : <div>no data yet</div>}
                     {/*  {coins && coins.length > 0 ? <PriceTable coins={coins} /> : <div>no data yet</div>} */}
                    </Suspense>
                 </div>
               </main>
             </>
    )
}

export default Market;
