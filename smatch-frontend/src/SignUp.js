import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useSignUp } from "./hooks";
import Logo from "./Logo.svg";

export default function Login() {
  const { isSuccessful, error, trySignUp } = useSignUp();
  const [ username, setUsername ] = useState("");
  const [ password, setPassword ] = useState("");
  const navigate = useNavigate();

  const signup = (e) => {
    trySignUp(username, password);
    e.preventDefault();
    return false;
  };

  useEffect(() => {
    if (isSuccessful) {
      navigate("/login");
    }
  }, [ isSuccessful ]);

  return (
    <div className="bg-slate-800 flex flex-col items-center justify-between min-h-screen p-5">
      <div className="mt-16 lg:mt-24">
        <img src={Logo} className="h-16 w-auto" />
      </div>
      <div className="w-full max-w-md">
        <form className="mt-8 flex flex-col items-center w-full px-5" onSubmit={(e) => signup(e)}>
          <h1 className="font-bold text-3xl lg:text-5xl text-white">Sign Up</h1>

          <input type="text" placeholder="Username" className="w-full px-4 py-2 rounded-full mt-8 text-gray-800" value={username} onChange={(e) => setUsername(e.target.value)} />
          <input type="password" placeholder="Password" className="w-full px-4 py-2 rounded-full mt-5 text-gray-800" value={password} onChange={(e) => setPassword(e.target.value)} />

          { error ? <p className="text-red-500 mt-2">{ error }</p> : <></> }
          <div className="flex justify-between w-full mt-5">
            <Link to="/login" className="bg-gray-100 hover:bg-gray-300 text-gray-800 rounded-full px-8 py-2">Log In</Link>
            <button className="bg-orange-600 hover:bg-orange-500 text-white rounded-full px-8 py-2" onClick={(e) => signup(e)}>Submit</button>
          </div>
        </form>
      </div>
      <div className="mb-16 flex flex-col items-center text-white">
        <p>All right reserved 2021</p>
        <p>Cassandra Spark</p>
      </div>
    </div>
  );
}
