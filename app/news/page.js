"use client";
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from "next/navigation";
import { Tab } from '@headlessui/react';
import { fetchAllNews } from '@/store/actions/newsAction';
import { getMarket } from '@/store/actions/portfolioAction';
import NewsMagazine from '../../components/NewsMagazine';
import MarketRail from '../../components/MarketRail';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

const TABS = ['Bitcoin', 'General', 'Alt Coins'];

function NewsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="aspect-[16/9] animate-pulse rounded-2xl bg-ink/5 lg:col-span-2" />
        <div className="flex flex-col gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-28 animate-pulse rounded-xl bg-ink/5" />
          ))}
        </div>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-48 animate-pulse rounded-xl bg-ink/5" />
        ))}
      </div>
    </div>
  );
}

function News() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { isAuthenticated, loading: authLoading } = useSelector((state) => state.auth);
  const { btcNews, altsNews, news, loading } = useSelector((state) => state.news);
  const { market } = useSelector((state) => state.market);

  // Handle authentication redirect
  useEffect(() => {
    if (!isAuthenticated && !authLoading) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  // Fetch all news data once on mount
  useEffect(() => {
    dispatch(fetchAllNews());
  }, [dispatch]);

  // Populate the price rail if the (persisted) market slice is empty
  useEffect(() => {
    if (!market) dispatch(getMarket());
  }, [market, dispatch]);

  const isLoading = loading || (!btcNews && !altsNews && !news);
  const panels = [btcNews, news, altsNews];

  if (!isAuthenticated) return null; // Early return while redirecting

  return (
    <>
      <header className="border-b border-ink/10 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="font-display text-3xl font-bold tracking-tight text-ink">News</h1>
          <p className="mt-1 text-ink/50">The latest across Bitcoin, majors, and the wider market.</p>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-4">
          <div className="lg:col-span-3">
            <Tab.Group>
              <Tab.List className="mb-6 flex space-x-1 rounded-xl bg-ink/5 p-1 sm:max-w-md">
                {TABS.map((tab) => (
                  <Tab
                    key={tab}
                    className={({ selected }) =>
                      classNames(
                        'w-full rounded-lg py-2.5 text-sm font-medium leading-5 transition',
                        'focus:outline-none focus-visible:ring-2 focus-visible:ring-teal',
                        selected
                          ? 'bg-white text-ink shadow'
                          : 'text-ink/50 hover:bg-white/60 hover:text-ink'
                      )
                    }
                  >
                    {tab}
                  </Tab>
                ))}
              </Tab.List>
              <Tab.Panels>
                {panels.map((articles, i) => (
                  <Tab.Panel key={i} className="focus:outline-none">
                    {isLoading ? <NewsSkeleton /> : <NewsMagazine articles={articles} />}
                  </Tab.Panel>
                ))}
              </Tab.Panels>
            </Tab.Group>
          </div>
          <div className="lg:col-span-1">
            <MarketRail />
          </div>
        </div>
      </main>
    </>
  );
}

export default News;
