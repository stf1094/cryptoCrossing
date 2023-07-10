"use client";
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from "next/navigation";
import NewsList from '../../components/NewsList';
import BtcNewsList from '../../components/BtcNewsList';
import AltsNewsList from '../../components/AltsNewsList';
import { fetchBitcoinNews, fetchAltsNews, fetchNews } from '@/store/actions/newsAction';
import { Tab } from '@headlessui/react';

function News() {
  const router = useRouter();
  const dispatch = useDispatch();
  const {isAuthenticated} = useSelector((state) => state.auth);
  const {btcNews, altsNews, news} = useSelector((state) => state.news);
  function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
  }
  useEffect(() => {
    if (!isAuthenticated) {
      console.log("user not authenticated to view this page...");
      router.push('/login');
    }
  }, []);
    useEffect(() => {
      dispatch(fetchNews());
      dispatch(fetchBitcoinNews());
      dispatch(fetchAltsNews());
    }, []); 

    return (
        <>
        <header className="bg-white shadow">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">News</h1>
          </div>
        </header>
        <main>
          <div className="mx-auto max-w-5xl py-6 sm:px-6 lg:px-8">
          <Tab.Group>
            <Tab.List className="flex space-x-1 rounded-xl bg-gray-200/70 p-1">
              <Tab className={({ selected }) =>
                classNames(
                  'w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-gray-800',
                  'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
                  selected
                    ? 'bg-white shadow'
                    : 'text-blue-100 hover:bg-gray-300/60 hover:text-black'
                )
              }>Bitcoin</Tab>
              <Tab className={({ selected }) =>
                classNames(
                  'w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-gray-800',
                  'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
                  selected
                    ? 'bg-white shadow'
                    : 'text-blue-100 hover:bg-gray-300/60 hover:text-black'
                )
              }>General</Tab>
              <Tab className={({ selected }) =>
                classNames(
                  'w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-gray-800',
                  'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
                  selected
                    ? 'bg-white shadow'
                    : 'text-blue-100 hover:bg-gray-300/60 hover:text-black'
                )
              }>Alt Coins</Tab>
            </Tab.List>
            <Tab.Panels className="mt-2">
              <Tab.Panel
              className={classNames(
                'rounded-xl bg-white p-3',
                'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2'
              )}>
                <BtcNewsList btcNews={btcNews} /> 
                
              </Tab.Panel>
              <Tab.Panel
              className={classNames(
                'rounded-xl bg-white p-3',
                'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2'
              )}>
                <NewsList news={news} /> 
              </Tab.Panel>
              <Tab.Panel
              className={classNames(
                'rounded-xl bg-white p-3',
                'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2'
              )}>
                 <AltsNewsList altsNews={altsNews} /> 
                
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
         
        {/*   <Tabs>
            <TabList>
              <Tab>Bitcoin</Tab>
              <Tab>General</Tab>
              <Tab>Alts</Tab>
            </TabList>

            <TabPanel>
                <div>btc news</div>
              {/*   <BtcNewsList btcNews={btcNews} /> 
            </TabPanel>
            <TabPanel>
                <div>news</div>
              {/*  <NewsList news={news} />
            </TabPanel>
            <TabPanel>
                <div>alts news</div>
            {/*   <AltsNewsList altsNews={altsNews} /> 
            </TabPanel>
          </Tabs>  */}
          </div>
        </main>
      </>
    )
}

export default News;

 {/*       <div style={{margin: "3em auto 1em auto"}}>    
      
          <Tabs>
            <TabList>
              <Tab>Bitcoin</Tab>
              <Tab>General</Tab>
              <Tab>Alts</Tab>
            </TabList>

            <TabPanel>
                <div>btc news</div>
                <BtcNewsList btcNews={btcNews} />
            </TabPanel>
            <TabPanel>
                <div>news</div>
               <NewsList news={news} />
            </TabPanel>
            <TabPanel>
                <div>alts news</div>
              <AltsNewsList altsNews={altsNews} /> 
            </TabPanel>
          </Tabs> 
        </div> */}
