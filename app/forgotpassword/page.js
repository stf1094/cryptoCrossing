"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { passwordResetEmail } from '../../store/actions/authAction';
import { useRouter } from 'next/navigation';

// import { redirect } from "next/dist/server/api-utils";
// import { Redirect } from "react-router-dom";
// import {setAlert} from '../../actions/alertAction';
// import {  } from '../../actions/authAction';

function ForgotPassword() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: ''
  });

const { email } = formData;

const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

const onSubmit = e => {
    e.preventDefault();
    dispatch(passwordResetEmail(email));
    setFormData('');
    router.push('/login');
}

     // redirect if logged in
    // if(isAuthenticated) {
     // return <Redirect to="/dashboard" />
  // }

  return (
    <>
    <div className="grid xs:grid-cols-1 xl:grid-cols-4 xl:gap-7">
    <div className="bg-sky-500 h-screen xs:hidden xl:block"></div>
      <div className="sign-in-container flex flex-column mx-auto my-auto h-screen w-screen sm:justify-center xs:mt-14 xs:px-8 sm:-mt-10 xl:col-span-2">
     <h1 className="large text-black font-bold">Forgot Password</h1>
      <p className="lead"><i className="fas fa-user"></i> Just enter your email below. If we have you in our system, you&apos;ll receive a link to reset your password.</p>
        <form className="form" onSubmit={e => onSubmit(e)}>
            <div className="form-group">
            <input 
                className="rounded-lg"
                type="email" 
                placeholder="Email Address" 
                value={email}
                onChange={e => onChange(e)}
                name="email" 
            />
            </div>
            <input type="submit" className="mt-3 bg-sky-400 py-3 px-8 text-white hover:bg-sky-300 hover:cursor-pointer rounded-xl" value="Send email" />
        </form>
        <p className="mt-6">
           Don&apos;t have an account? <Link className="text-blue-500" href="/register">Sign Up</Link>
        </p>
        </div>
        <div className="bg-blue-500 h-screen w-100 xs:hidden xl:block"></div>
        </div>
</>
  )
}
export default ForgotPassword;