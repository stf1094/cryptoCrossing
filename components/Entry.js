import React, {Suspense} from 'react';
import Navbar2 from './Navbar2';
import { useSelector } from 'react-redux';

function Entry({children}) {
  const {isAuthenticated} = useSelector((state) => state.auth);

  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        {isAuthenticated && <Navbar2 />}
        {children}
      </Suspense>
    </>
  )
}

export default Entry;