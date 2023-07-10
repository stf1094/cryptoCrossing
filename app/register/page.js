"use client";
import React, { useState, useEffect } from "react";
import { register } from '../../store/actions/authAction';
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import Link from "next/link";
// import { setAlert } from '../../actions/alertAction';
// import { Redirect } from "react-router-dom";

const Register = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const {isAuthenticated, user} = useSelector((state) => state.auth);
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

/* useEffect(() => {
  console.log(formErrors);
  if (Object.keys(formErrors).length === 0 && isSubmit) {
    console.log(formData);
  }
}, [formErrors]); */

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
    router.push('/dashboard');
  }
}, [user]);

  return (
    <>
     <div className="grid xs:grid-cols-1 xl:grid-cols-4 xl:gap-7">
      <div className="bg-sky-500 h-screen xs:hidden xl:block"></div>
      <div className="register-container flex flex-column mx-auto my-auto h-screen w-screen sm:justify-center xs:mt-14 xs:px-8 sm:-mt-10 xl:col-span-2">
        <h1 className="large text-black font-bold">Sign Up</h1>
        <p className="lead"><i className="fas fa-user"></i> Create Your Account</p>
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
                minLength="7"
            />
            </div>
            <input type="submit" className="mt-3 bg-sky-400 py-3 px-8 text-white hover:bg-sky-300 hover:cursor-pointer rounded-xl" value="Register" />
        </form>
        <p className="mt-6">
           Already have an account? <Link className="text-blue-500" href="/login">Login</Link>
        </p>
        </div>
        <div className="bg-blue-500 h-screen w-100 xs:hidden xl:block"></div>
   </div>
</>

  )
}

export default Register;