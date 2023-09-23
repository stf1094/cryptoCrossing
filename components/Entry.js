import React from 'react';
import Navbar2 from './Navbar2';
import { useDispatch, useSelector } from 'react-redux';
import Home from '@/app/page';

function Entry({children}) {
  const dispatch = useDispatch();
  const {isAuthenticated, user, error, loading} = useSelector((state) => state.auth);

  return (
    <>
    {isAuthenticated ? 
    <>
    <Navbar2 />
    {children}
    </>
    :
    <>
    {children}
    </>
    }
    </>
  )
}

export default Entry;