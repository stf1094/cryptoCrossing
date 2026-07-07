"use client";
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

function Account() {
  const {user} = useSelector((state) => state.auth);
  return (
    <>
      <header className="border-b border-ink/10 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="font-display text-3xl font-bold tracking-tight text-ink">My account</h1>
        </div>
      </header>
      <main>
        <div className="mx-auto max-w-7xl py-6 xs:px-8 sm:px-6 lg:px-8">
          <div className="max-w-md rounded-2xl border border-ink/10 bg-white p-6">
            <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-teal-600">Signed in as</p>
            <p className="mt-2 font-mono text-lg tabular-nums text-ink">
              {user?.email || (user?.isAnonymous ? 'Guest session' : '—')}
            </p>
          </div>
        </div>
     </main>
  </>
  )
}

export default Account;