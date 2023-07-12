"use client";
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

function Account() {
  const {user} = useSelector((state) => state.auth);
  return (
    <>
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">My Account</h1>
        </div>
      </header>
      <main>
      <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
        <div>Account Page</div>
        {user ? <div>{user.email}</div> : <div></div>}
      </div>
     </main>
  </>
  )
}

export default Account;