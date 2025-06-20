import React, { useState } from "react";
import logo from "../../public/shivam.jpeg";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { backendUrl } from "../utils/utils";
function Adminsignup() {
  const [firstname, setFirstName] = useState("");
  const [lastname, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const togglePassword = () => setShowPassword(prev => !prev);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${backendUrl}/admin/signup`,
        { firstname, lastname, email, password },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );
      console.log("Signup successful: ", response.data);
      toast.success(response.data.message);
      navigate("/admin/login");
    } catch (error) {
      if (error.response) {
        setErrorMessage(error.response.data.message);
      }
    }
  };

  return (
    <div className="bg-gradient-to-r from-black to-blue-950 min-h-screen">
      <div className="container mx-auto flex items-center justify-center text-white px-4 sm:px-6 h-full">
        
        {/* Header */}
        <header className="absolute top-0 left-0 w-full flex justify-between items-center p-4 sm:p-5">
          <div className="flex items-center space-x-2">
            <img src={logo} alt="Logo" className="w-10 h-10 rounded-full" />
            <Link to={"/"} className="text-lg sm:text-xl font-bold text-orange-500">
              Coursify
            </Link>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-4">
            <Link
              to={"/admin/login"}
              className="bg-transparent border border-gray-500 text-xs sm:text-sm md:text-md py-1 px-2 sm:py-2 sm:px-4 rounded-md"
            >
              Login
            </Link>
            <Link
              to={"/courses"}
              className="bg-orange-500 text-xs sm:text-sm md:text-md py-1 px-2 sm:py-2 sm:px-4 rounded-md"
            >
              Join now
            </Link>
          </div>
        </header>

        {/* AdminSignup Form */}
        <div className="bg-gray-900 p-6 sm:p-8 rounded-lg shadow-lg w-full sm:max-w-md md:max-w-lg mt-20 sm:mt-28">
          <h2 className="text-xl sm:text-2xl font-bold mb-4 text-center">
            Welcome to <span className="text-orange-500">Coursify</span>
          </h2>
          <p className="text-sm sm:text-base text-center text-gray-400 mb-6">
            Just signup to mess with dashboard!
          </p>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="firstname" className="block text-gray-400 mb-2">
                Firstname
              </label>
              <input
                type="text"
                id="firstname"
                value={firstname}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full p-3 rounded-md bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Type your firstname"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="lastname" className="block text-gray-400 mb-2">
                Lastname
              </label>
              <input
                type="text"
                id="lastname"
                value={lastname}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full p-3 rounded-md bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Type your lastname"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-400 mb-2">
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
              <label htmlFor="password" className="block text-gray-400 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
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
              Signup
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Adminsignup;
