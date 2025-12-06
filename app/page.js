"use client";
import Image from 'next/image';
import Link from 'next/link';
import logo from '../assets/crypto-crossing-logo.png';
import logoWhite from '../assets/crypto-crossing-logo-white.png';
import iconLogo from '../assets/crypto-crossing-icon.png';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from "next/navigation";
import { Dialog } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBarChart, faChartLine, faNewspaper, faCoins } from '@fortawesome/free-solid-svg-icons';
import HomePriceTable from '@/components/HomePriceTable';
import { setUser, loginAnon } from '@/store/actions/authAction';
import { getMarket } from '@/store/actions/portfolioAction';

const config = {
  headers: {
      'Access-Control-Allow-Origin': 'https://api.coingecko.com/api/',
  }
}

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Features', href: '#' },
  { name: 'Tech', href: '#' },
]

export default function Home() {
  const {user, isAuthenticated, loading} = useSelector((state) => state.auth);
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [homeCoins, setHomeCoins] = useState([]);
  const [coinsLoading, setCoinsLoading] = useState(true);
  const dispatch = useDispatch();

  // Check authentication status on mount
  useEffect(() => {
    dispatch(setUser());
  }, [dispatch]);

  // Redirect to portfolio if user is authenticated
  useEffect(() => {
    if (isAuthenticated && !loading) {
      router.push('/portfolio');
    }
  }, [isAuthenticated, loading, router]);

  // Fetch market data and home coins once on mount
  useEffect(() => {
    // Fetch general market data for Redux
    dispatch(getMarket());

    // Fetch specific coins for home page display
    setCoinsLoading(true);
    fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin%2C%20ethereum%2C%20dogecoin%2C%20ripple%2C%20litecoin%2C%20cardano%2C%20solana%2C%20polkadot%2C%20matic-network%2C%20binancecoin&order=market_cap_desc&sparkline=false&price_change_percentage=24h%2C7d%2C30d&locale=en&precision=2', config)
      .then((res) => res.json())
      .then((data) => {
        setHomeCoins(data);
        setCoinsLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching home coins:', error);
        setCoinsLoading(false);
      });
  }, [dispatch]);

  const handleLoginAnon = async () => {
    await dispatch(loginAnon());
    router.push('/portfolio');
  };
  return (
    <>
    <main>
    <header className="absolute inset-x-0 top-0 z-50">
       <nav className="flex items-center justify-between p-6 lg:px-8" aria-label="Global">
          <div className="flex lg:flex-1">
            <a href="#" className="-m-1.5 p-1.5">
              <span className="sr-only">Crypto Crossing</span>
              <Image src={logo} alt="logo" className="h-12 w-auto"></Image>
            </a>
          </div>
          <div className="flex lg:hidden">
            <button
              type="button"
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
              onClick={() => setMobileMenuOpen(true)}
            >
              <span className="sr-only">Open main menu</span>
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="hidden lg:flex lg:gap-x-12">
            {navigation.map((item) => (
              <a key={item.name} href={item.href} className="text-sm font-semibold leading-6 text-gray-900">
                {item.name}
              </a>
            ))}
          </div>
          <div className="hidden lg:flex lg:flex-1 lg:justify-end">
             <Link href='/login' className='text-sm bg-sky-400 text-white py-2 px-3 rounded-lg hover:bg-sky-300 mr-2'>Login</Link>
             <Link href='/register' className='text-sm bg-blue-500 text-white py-2 px-3 rounded-lg hover:bg-blue-400 mr-2'>Sign Up</Link>
          </div>
        </nav>
        <Dialog as="div" className="lg:hidden" open={mobileMenuOpen} onClose={setMobileMenuOpen}>
          <div className="fixed inset-0 z-50" />
          <Dialog.Panel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
            <div className="flex items-center justify-between">
              <a href="#" className="-m-1.5 p-1.5">
                <span className="sr-only">Your Company</span>
                <Image
                  className="h-10 w-auto"
                  src={iconLogo}
                  alt="icon logo"
                />
              </a>
              <button
                type="button"
                className="-m-2.5 rounded-md p-2.5 text-gray-700"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="sr-only">Close menu</span>
                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-gray-500/10">
                <div className="space-y-2 py-6">
                  {navigation.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                    >
                      {item.name}
                    </a>
                  ))}
                </div>
                <div className="py-6">
                  <a
                    href={"/login"}
                    className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                  >
                    Log in
                  </a>
                  <a
                    href={"/register"}
                    className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                  >
                    Sign Up
                  </a>
                </div>
              </div>
            </div>
          </Dialog.Panel>
        </Dialog>
        </header>
       <div className="landing-inner">
     
      <div className="landing-hero">
          <h1 className="x-large font-bold">One place for all <br></br> things crypto</h1>
          <p className="lead">
          Track your portfolio and stay up to date with news.
          </p>
          <div className="buttons text-white mt-7">
            <Link href='/register' className='bg-sky-400 text-white py-5 px-10 rounded-xl hover:bg-sky-300 mr-2'>Sign Up</Link>
            <button onClick={handleLoginAnon} className='bg-blue-500 py-4 px-9 rounded-xl hover:bg-blue-400 ml-2'>Go to App</button>
          </div>
      </div>
      <div className="w-screen">
       <svg id="visual" viewBox="0 0 900 213" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" version="1.1">
          <rect x="0" y="0" width="100%" height="100%" fill="#ffffff"></rect>
          <path d="M0 67L16.7 74.2C33.3 81.3 66.7 95.7 100 98.8C133.3 102 166.7 94 200 84C233.3 74 266.7 62 300 67C333.3 72 366.7 94 400 99.7C433.3 105.3 466.7 94.7 500 82.5C533.3 70.3 566.7 56.7 600 52C633.3 47.3 666.7 51.7 700 53C733.3 54.3 766.7 52.7 800 48.7C833.3 44.7 866.7 38.3 883.3 35.2L900 32L900 214L883.3 214C866.7 214 833.3 214 800 214C766.7 214 733.3 214 700 214C666.7 214 633.3 214 600 214C566.7 214 533.3 214 500 214C466.7 214 433.3 214 400 214C366.7 214 333.3 214 300 214C266.7 214 233.3 214 200 214C166.7 214 133.3 214 100 214C66.7 214 33.3 214 16.7 214L0 214Z" fill="#7dd3fc"></path>
          <path d="M0 105L16.7 111.2C33.3 117.3 66.7 129.7 100 138.2C133.3 146.7 166.7 151.3 200 145C233.3 138.7 266.7 121.3 300 116.7C333.3 112 366.7 120 400 116.8C433.3 113.7 466.7 99.3 500 104C533.3 108.7 566.7 132.3 600 132.2C633.3 132 666.7 108 700 107.5C733.3 107 766.7 130 800 132.2C833.3 134.3 866.7 115.7 883.3 106.3L900 97L900 214L883.3 214C866.7 214 833.3 214 800 214C766.7 214 733.3 214 700 214C666.7 214 633.3 214 600 214C566.7 214 533.3 214 500 214C466.7 214 433.3 214 400 214C366.7 214 333.3 214 300 214C266.7 214 233.3 214 200 214C166.7 214 133.3 214 100 214C66.7 214 33.3 214 16.7 214L0 214Z" fill="#38aefe"></path>
          <path d="M0 187L16.7 183C33.3 179 66.7 171 100 161.3C133.3 151.7 166.7 140.3 200 144.5C233.3 148.7 266.7 168.3 300 172.3C333.3 176.3 366.7 164.7 400 156.7C433.3 148.7 466.7 144.3 500 147.8C533.3 151.3 566.7 162.7 600 169.8C633.3 177 666.7 180 700 182.5C733.3 185 766.7 187 800 184.3C833.3 181.7 866.7 174.3 883.3 170.7L900 167L900 214L883.3 214C866.7 214 833.3 214 800 214C766.7 214 733.3 214 700 214C666.7 214 633.3 214 600 214C566.7 214 533.3 214 500 214C466.7 214 433.3 214 400 214C366.7 214 333.3 214 300 214C266.7 214 233.3 214 200 214C166.7 214 133.3 214 100 214C66.7 214 33.3 214 16.7 214L0 214Z" fill="#3b82f6"></path>
        </svg>
      </div>
      {/* <div className="w-screen bg-blue-500 flex flex-column items-center">
        <div className="container my-24 sm:px-4 md:px-2">
          <div className="border-transparent rounded-xl mx-auto max-w-5xl pb-6 background-white shadow-2xl shadow-blue-900/80">
            {coinsLoading ? (
              <div className="text-center py-10 text-gray-500">Loading market data...</div>
            ) : homeCoins && homeCoins.length > 0 ? (
              <HomePriceTable coins={homeCoins} />
            ) : (
              <div className="text-center py-10 text-gray-500">Unable to load market data</div>
            )}
          </div>
        </div>
      </div> */}
      <div className="container my-24 text-left lg:px-12 xs:px-4">
          <div className="grid md:grid-cols-8 gap-x-9 gap-y-12 mb-10 xs:grid-cols-1">
              <div className="col-span-5 mb-9">
                  <h2 className="text-5xl font-bold">Some time that explains the features of the app.</h2>
              </div>
              <div className="col-span-4 md:pr-6">
                 <div className="flex flex-column content-start items-start">
                   <FontAwesomeIcon className="fa-3x mt-2 fa-border rounded-xl text-blue-600 fa-border border-sky-200 bg-sky-200" icon={faBarChart} />
                   <h3 className="mt-5 text-3xl font-semibold">Track your portfolio</h3>
                   <p className="mt-4 text-lg opacity-75">Add and update your portfolio to track values over time.</p>
                 </div>
              </div>
              <div className="col-span-4 md:pr-6">
              <div className="flex flex-column content-start items-start">
                   <FontAwesomeIcon className="fa-3x mt-2 rounded-xl text-blue-600 fa-border border-sky-200 bg-sky-200" icon={faNewspaper} />
                   <h3 className="mt-5 text-3xl font-semibold">Read the latest stories</h3>
                   <p className="mt-4 text-lg opacity-75">Get up to date news from across the crypto world, from all types of souces. Inlcudes Bitcoin, Ethereum, alt-coins, and general market news.</p>
                 </div>
              </div>
              <div className="col-span-4 md:pr-6">
              <div className="flex flex-column content-start items-start">
                   <FontAwesomeIcon className="fa-3x mt-2 fa-border rounded-xl text-blue-600 fa-border border-sky-200 bg-sky-200" icon={faChartLine} />
                   <h3 className="mt-5 text-3xl font-semibold">Keep up with the market</h3>
                   <p className="mt-4 text-lg opacity-75">Follow and track market prices over the days, weeks, and monthly timeframes.</p>
                 </div>
              </div>
              <div className="col-span-4 md:pr-6">
                <div className="flex flex-column content-start items-start">
                   <FontAwesomeIcon className="fa-3x mt-2 fa-border rounded-xl text-blue-600 fa-border border-sky-200 bg-sky-200" icon={faCoins} />
                   <h3 className="mt-5 text-3xl font-semibold">Find market trends</h3>
                   <p className="mt-4 text-lg opacity-75">Discover the crypto currencies that are trending up and down to help make smarter buying and selling decisions.</p>
                 </div>
              </div>
          </div>
      </div>
      </div>
      <section className="footer">
      <svg id="visual" viewBox="0 0 900 213" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" version="1.1">
        <rect x="0" y="0" width="100%" height="100%" fill="#3b82f6"></rect>
        <path d="M0 136L16.7 131.3C33.3 126.7 66.7 117.3 100 118.8C133.3 120.3 166.7 132.7 200 136.8C233.3 141 266.7 137 300 133.8C333.3 130.7 366.7 128.3 400 135.2C433.3 142 466.7 158 500 160.8C533.3 163.7 566.7 153.3 600 142.7C633.3 132 666.7 121 700 114.8C733.3 108.7 766.7 107.3 800 113.5C833.3 119.7 866.7 133.3 883.3 140.2L900 147L900 0L883.3 0C866.7 0 833.3 0 800 0C766.7 0 733.3 0 700 0C666.7 0 633.3 0 600 0C566.7 0 533.3 0 500 0C466.7 0 433.3 0 400 0C366.7 0 333.3 0 300 0C266.7 0 233.3 0 200 0C166.7 0 133.3 0 100 0C66.7 0 33.3 0 16.7 0L0 0Z" fill="#3b82f6"></path>
        <path d="M0 67L16.7 72.5C33.3 78 66.7 89 100 95.3C133.3 101.7 166.7 103.3 200 101.2C233.3 99 266.7 93 300 97.3C333.3 101.7 366.7 116.3 400 115.3C433.3 114.3 466.7 97.7 500 88.2C533.3 78.7 566.7 76.3 600 83.8C633.3 91.3 666.7 108.7 700 113.5C733.3 118.3 766.7 110.7 800 109.7C833.3 108.7 866.7 114.3 883.3 117.2L900 120L900 0L883.3 0C866.7 0 833.3 0 800 0C766.7 0 733.3 0 700 0C666.7 0 633.3 0 600 0C566.7 0 533.3 0 500 0C466.7 0 433.3 0 400 0C366.7 0 333.3 0 300 0C266.7 0 233.3 0 200 0C166.7 0 133.3 0 100 0C66.7 0 33.3 0 16.7 0L0 0Z" fill="#38aefe"></path>
        <path d="M0 25L16.7 33C33.3 41 66.7 57 100 56.3C133.3 55.7 166.7 38.3 200 30.8C233.3 23.3 266.7 25.7 300 31.5C333.3 37.3 366.7 46.7 400 47.7C433.3 48.7 466.7 41.3 500 42.7C533.3 44 566.7 54 600 58.5C633.3 63 666.7 62 700 55.5C733.3 49 766.7 37 800 31.3C833.3 25.7 866.7 26.3 883.3 26.7L900 27L900 0L883.3 0C866.7 0 833.3 0 800 0C766.7 0 733.3 0 700 0C666.7 0 633.3 0 600 0C566.7 0 533.3 0 500 0C466.7 0 433.3 0 400 0C366.7 0 333.3 0 300 0C266.7 0 233.3 0 200 0C166.7 0 133.3 0 100 0C66.7 0 33.3 0 16.7 0L0 0Z" fill="#7dd3fc"></path>
      </svg>
     
      <div className="footer-inner">
        <Image src={logoWhite} alt="footer-logo" className="w-44"></Image>
        </div>
        <p className="mt-1 mb-10">Built with React, NextJS, Redux, Firebase, & Coin Gecko API.</p>
        </section>
    </main>
    </>
  )
}
