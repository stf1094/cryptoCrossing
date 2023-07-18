"use client";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import Link from "next/link";
import { useRouter } from "next/navigation";
import { login } from '../../store/actions/authAction';
import Image from 'next/image';
import logo from '@/assets/crypto-crossing-logo.png';
import Loading from "@/components/Loading";

function Login() {
  const dispatch = useDispatch();
  const router = useRouter();
  const {isAuthenticated, user, error, loading} = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

const { email, password } = formData;

const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

const onSubmit = e => {
    e.preventDefault();
    dispatch(login(email, password));
}

useEffect(() => {
  if(isAuthenticated) {
    router.push('/portfolio');
  }
}, [user]);
     // redirect if logged in
    // if(isAuthenticated) {
    //  return <Redirect to="/dashboard" />
    //   }

  return (
    <>
   
     <div className="grid xs:grid-cols-1 xl:grid-cols-4 xl:gap-7">
      <div className="bg-sky-500 h-screen xs:hidden xl:block"></div>
     
      <div className="sign-in-container flex flex-column mx-auto my-auto h-screen w-screen sm:justify-center xs:mt-14 xs:px-8 sm:-mt-10 xl:col-span-2">
        <Image src={logo} alt="crypto-logo" className="w-44 mb-12"></Image>
        <h1 className="large text-black font-bold">Log In</h1>
        <p className="lead"><i className="fas fa-user"></i> Sign into your Account</p>
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
            <div className="form-group">
            <input
                className="rounded-lg"
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => onChange(e)}
                name="password"
            />
            </div>
            
            <input type="submit" className="mt-3 bg-sky-400 py-3 px-8 text-white hover:bg-sky-300 hover:cursor-pointer rounded-xl" value="Login" />
        </form>
        <p className="mt-6">
           Don't have an account? <Link className="text-blue-500" href="/register">Sign Up</Link>
        </p>
        <p className="my-2">
           Forgot your password? <Link className="text-blue-500" href="/forgotpassword">Click Here</Link>
        </p>
        </div>
         
        <div className="bg-blue-500 h-screen w-100 xs:hidden xl:block"></div>
        </div>
   
    </>
  )
}

export default Login;