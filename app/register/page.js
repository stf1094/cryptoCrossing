"use client";
import React, { useState, useEffect } from "react";
import { register } from '../../store/actions/authAction';
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from 'next/image';
import logo from '@/assets/crypto-crossing-logo.png';
// import Loading from "@/components/Loading";

const Register = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const {isAuthenticated, user, loading} = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  /* const [formErrors, setFormErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false); */
  const { email, password } = formData;

const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

const onSubmit = e => {
    e.preventDefault();
   // setFormErrors(validate(formData));
   // setIsSubmit(true);
    dispatch(register(email, password));
}

/* const validate = (values) => {
  const errors = {};
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
  if (!values.email) {
   // errors.email = "Email is required!";
    setAlert('Email is required', 'warning');
  } else if (!regex.test(values.email)) {
   // errors.email = "This is not a valid email format!";
    setAlert('This is not a valid email address', 'warning');
  }
  if (!values.password) {
   // errors.password = "Password is required";
    setAlert('Password is required', 'warning');
  } else if (values.password.length < 4) {
   // errors.password = "Password must be more than 4 characters";
    setAlert('Password must be 6 or more characters', 'warning');
  } else if (values.password.length > 10) {
   // errors.password = "Password cannot exceed more than 10 characters";
    setAlert('Password cannot exceed 10 characters', 'warning');
  }
  return errors;
}; */
useEffect(() => {
  if(isAuthenticated) {
    router.push('/portfolio');
  }
}, [user]);

  return (
    <>
     <div className="grid min-h-screen xs:grid-cols-1 xl:grid-cols-5">
      <div
        className="hidden bg-ink p-12 text-white xl:col-span-2 xl:flex xl:flex-col xl:justify-between"
        style={{ backgroundImage: 'radial-gradient(70% 50% at 20% 10%, rgba(68,210,218,0.18), transparent 60%)' }}
      >
        <span className="font-mono text-xs uppercase tracking-[0.28em] text-teal">Crypto Crossing</span>
        <div>
          <h2 className="font-display text-4xl font-bold leading-tight">Track every coin you hold, in one place.</h2>
          <p className="mt-4 max-w-sm text-white/60">Create an account to start building your portfolio in under a minute.</p>
        </div>
        <span className="font-mono text-xs text-white/30">Portfolio · Markets · News</span>
      </div>
      <div className="register-container flex flex-column mx-auto my-auto h-screen w-screen sm:justify-center xs:mt-14 xs:px-8 sm:-mt-10 xl:col-span-3">
      <Image src={logo} alt="crypto-logo" className="w-44 mb-12"></Image>
        <h1 className="large font-display text-ink font-bold">Sign up</h1>
        <p className="lead">Create your account to get started.</p>
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
            <input type="submit" className="mt-3 bg-teal py-3 px-8 font-semibold text-ink hover:bg-teal-600 hover:cursor-pointer rounded-xl transition-colors" value="Create account" />
        </form>
        <p className="mt-6">
           Already have an account? <Link className="font-medium text-teal-600 hover:text-teal" href="/login">Log in</Link>
        </p>
        </div>
   </div>
</>

  )
}

export default Register;