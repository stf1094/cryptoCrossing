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
   
     <div className="grid min-h-screen xs:grid-cols-1 xl:grid-cols-5">
      <div
        className="hidden bg-ink p-12 text-white xl:col-span-2 xl:flex xl:flex-col xl:justify-between"
        style={{ backgroundImage: 'radial-gradient(70% 50% at 20% 10%, rgba(68,210,218,0.18), transparent 60%)' }}
      >
        <span className="font-mono text-xs uppercase tracking-[0.28em] text-teal">Crypto Crossing</span>
        <div>
          <h2 className="font-display text-4xl font-bold leading-tight">Your portfolio is right where you left it.</h2>
          <p className="mt-4 max-w-sm text-white/60">Log in to pick up your holdings, market view, and news in one place.</p>
        </div>
        <span className="font-mono text-xs text-white/30">Portfolio · Markets · News</span>
      </div>

      <div className="sign-in-container flex flex-column mx-auto my-auto h-screen w-screen sm:justify-center xs:mt-14 xs:px-8 sm:-mt-10 xl:col-span-3">
        <Image src={logo} alt="crypto-logo" className="w-44 mb-12 cursor-pointer" onClick={() => router.push('/')}></Image>
        <h1 className="large font-display text-ink font-bold">Log in</h1>
        <p className="lead">Welcome back — sign into your account.</p>
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
            
            <input type="submit" className="mt-3 bg-teal py-3 px-8 font-semibold text-ink hover:bg-teal-600 hover:cursor-pointer rounded-xl transition-colors" value="Log in" />
        </form>
        <p className="mt-6">
           Don&apos;t have an account? <Link className="font-medium text-teal-600 hover:text-teal" href="/register">Sign up</Link>
        </p>
        <p className="my-2">
           Forgot your password? <Link className="font-medium text-teal-600 hover:text-teal" href="/forgotpassword">Reset it</Link>
        </p>
        </div>
        </div>
   
    </>
  )
}

export default Login;