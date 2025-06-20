import { Link, useNavigate } from 'react-router-dom';
import logo from "../../public/shivam.jpeg";
import axios from "axios";
import React, { useState } from "react";
import toast from 'react-hot-toast';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { backendUrl } from "../utils/utils";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const togglePassword = () => {
    setShowPassword(prev => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${backendUrl}/user/login`,
        { email, password },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );
      toast(response.data.message);
      localStorage.setItem("user", JSON.stringify(response.data));
      navigate("/");
    } catch (error) {
      if (error.response) {
        setErrorMessage(error.response.data.message || "Login failed!!!");
      }
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-r from-black to-blue-950'>
      <div className='[&>*]:mx-auto text-white px-4 sm:px-6 md:px-8'>
        <header className="flex flex-col sm:flex-row justify-between items-center max-w-full py-5 gap-4 sm:gap-0"> 
          <div className='flex gap-1 items-center'>
            <img src={logo} alt="logo" className="w-10 h-10 rounded-full" />
            <h1 className='text-2xl text-orange-500 font-bold'>Coursify</h1>
          </div>
          <div className='flex gap-3'>
            <Link to="/signup" className='bg-transparent text-white py-2 px-4 border border-gray-500 rounded-md text-center'>
              Signup
            </Link>
            <Link to="/courses" className='bg-orange-500 text-white py-2 px-4 rounded-md text-center'>
              join now
            </Link>
          </div>
        </header>

        <div className="bg-gray-900 p-6 sm:p-8 rounded-lg shadow-lg w-full sm:w-[500px] mt-10 mb-10">
          <h2 className="text-2xl font-bold mb-4 text-center">
            Welcome to <span className="text-orange-500">Coursify</span>
          </h2>
          <p className="text-center text-gray-400 mb-6">
             Login to access paid content!
          </p>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="email" className="text-gray-400 mb-2">
                Email
              </label>
              <input
                type="text"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 rounded-md bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="name@email.com"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="password" className="text-gray-400 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 pr-10 rounded-md bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="********"
                  required
                />
                <span
                  className="absolute right-3 top-3 text-gray-500 cursor-pointer"
                  onClick={togglePassword}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </div>

            {errorMessage && (
              <div className="mb-4 text-red-500 text-center">
                {errorMessage}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-orange-500 hover:bg-blue-600 text-white py-3 px-6 rounded-md transition"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
