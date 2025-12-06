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
  const {isAuthenticated, loading: authLoading} = useSelector((state) => state.auth);
  const {btcNews, altsNews, news, loading} = useSelector((state) => state.news);

  function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
  }

  // Handle authentication redirect
  useEffect(() => {
    if (!isAuthenticated && !authLoading) {
      console.log("user not authenticated to view this page...");
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  // Fetch all news data once on mount
  useEffect(() => {
    dispatch(fetchNews());
    dispatch(fetchBitcoinNews());
    dispatch(fetchAltsNews());
  }, [dispatch]);

  // Determine if we're still loading any news data
  const isLoading = loading || (!btcNews && !altsNews && !news);

  if (!isAuthenticated) return null; // Early return while redirecting 

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
                'sm:rounded-xl bg-white p-3',
                'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2'
              )}>
                {isLoading ? (
                  <div className="text-center py-10 text-gray-500">Loading Bitcoin news...</div>
                ) : btcNews && btcNews.length > 0 ? (
                  <BtcNewsList btcNews={btcNews} />
                ) : (
                  <div className="text-center py-10 text-gray-500">No Bitcoin news available</div>
                )}
              </Tab.Panel>
              <Tab.Panel
              className={classNames(
                'sm:rounded-xl bg-white p-3',
                'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2'
              )}>
                {isLoading ? (
                  <div className="text-center py-10 text-gray-500">Loading general news...</div>
                ) : news && news.length > 0 ? (
                  <NewsList news={news} />
                ) : (
                  <div className="text-center py-10 text-gray-500">No general news available</div>
                )}
              </Tab.Panel>
              <Tab.Panel
              className={classNames(
                'sm:rounded-xl bg-white p-3',
                'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2'
              )}>
                {isLoading ? (
                  <div className="text-center py-10 text-gray-500">Loading alt coin news...</div>
                ) : altsNews && altsNews.length > 0 ? (
                  <AltsNewsList altsNews={altsNews} />
                ) : (
                  <div className="text-center py-10 text-gray-500">No alt coin news available</div>
                )}
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
          </div>
        </main>
      </>
    )
}

export default News;
