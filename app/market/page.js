"use client";
import React, {Suspense, useEffect} from 'react';
import PriceTable from '../../components/PriceTable';
import { getHotColdCoins, getMarket } from '@/store/actions/portfolioAction';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowTrendingUpIcon, ArrowTrendingDownIcon } from '@heroicons/react/24/solid';
import TrendingSlider from '@/components/TrendingSlider';
// import useSWR from 'swr';

/* const config = {
  headers: {
      'Access-Control-Allow-Origin': 'https://api.coingecko.com/api/v3'
  }
} */

// const fetcher = (url) => fetch(url,  { headers: {'Access-Control-Allow-Origin': '*'} }).then((res) => res.json());
// const API = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=24h%2C7d%2C30d&locale=en&precision=2";

function Market() {
  // const { data, error } = useSWR(API, fetcher);
  const {market, hot7, hot30, cold7, cold30} = useSelector((state) => state.market);
  // const router = useRouter();
  const dispatch = useDispatch();
  // const [coins, setCoins] = useState([]);
  // if (error) console.log(error);
  // if (data) console.log(data[0].price_change_percentage_30d_in_currency.toFixed(2));
  // const market = getMarketData();
  // const [coins] = await Promise.all([market]);

  useEffect(() => {
    dispatch(getHotColdCoins());
  }, []);
  useEffect(() => {
    dispatch(getMarket());
  }, []);
/* 
    // console.log('after try catch data fetch');
  }, []); */
  // console.log("Is data ready?", !!data);
  console.log(hot30);
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
                      {hot30 && hot30.length > 0 ? <TrendingSlider hot7={hot30} /> : <div>no data yet</div> } 
                    </div>
                    <h3 className="text-lg font-bold mb-2 xs:px-4 md:px-0">Top 100</h3>
                    <Suspense fallback={<div>Loading...</div>}>
                       {market && market.length > 0 ? <PriceTable coins={market} /> : <div>no data yet</div>}
                    </Suspense> 
                 </div>
               </main>
             </>
    )
}

export default Market;
