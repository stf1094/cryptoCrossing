"use client";
import React, { useState } from "react";
// import { connect } from 'react-redux';
//import FirebaseAuthService from "../firebase/auth";
// import { Redirect } from "react-router-dom";
// import {setAlert} from '../../actions/alertAction';
// import {  } from '../../actions/authAction';

function ForgotPassword() {
  const [formData, setFormData] = useState({
    email: ''
  });

const { email } = formData;

const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

const onSubmit = e => {
    e.preventDefault();
   // console.log('clicked: ' + email);
   // setAlert('We sent you and email to reset your password', 'warning');
}

     // redirect if logged in
    // if(isAuthenticated) {
     // return <Redirect to="/dashboard" />
  // }

  return (
    <>
      <div className="sign-in-container">
     {/*  <h1 className="large text-primary">Sign In</h1> */}
      <p className="lead"><i className="fas fa-user"></i> Forgot your password?</p>
        <form className="form" onSubmit={e => onSubmit(e)}>
            <div className="form-group">
            <input 
                type="email" 
                placeholder="Email Address" 
                value={email}
                onChange={e => onChange(e)}
                name="email" 
            />
            </div>
            <input type="submit" className="btn btn-primary" value="Send email" />
        </form>
        </div>
</>
  )
}
export default ForgotPassword;