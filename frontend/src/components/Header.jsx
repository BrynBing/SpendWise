import React from 'react';
import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <div className="navbar bg-base-100 shadow-sm">
      <div className="navbar-start">
        {/* Your commented dropdown code */}
        <Link className="btn btn-ghost text-xl" to="/">SpendWise</Link>
      </div>
      
      {/* This empty div helps push the login/signup buttons to the right */}
      <div className="navbar-center"></div>
      
      {/* The navbar-end class will position these elements at the right */}
      <div className="navbar-end">
        <Link to="/login" className="mr-2">
          <button className="btn">Login</button>
        </Link>
        <Link to="/signup">
          <button className="btn">Sign up</button>
        </Link>
      </div>
    </div>
  );
}
