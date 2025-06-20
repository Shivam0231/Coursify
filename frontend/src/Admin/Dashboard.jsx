import React from "react";
import { Link } from "react-router-dom";
import logo from "../../public/shivam.jpeg";
import toast from "react-hot-toast";
import axios from "axios";
import { backendUrl } from "../utils/utils";
import {useAuth} from '../context/AuthContext'
function Dashboard() {
    const {setAdmin} = useAuth();
   const handleLogout = async () => {
    try {
      const response = await axios.get(`${backendUrl}/admin/logout`, {
        withCredentials: true,
      });
      toast.success(response.data.message);
      localStorage.removeItem("admin");
      setAdmin(null);
    } catch (error) {
      console.log("Error in logging out ", error);
      toast.error(error.response?.data?.message || "Error in logging out");
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Sidebar */}
      <div className="w-full md:w-64 bg-gray-100 p-5">
        <div className="flex items-center flex-col mb-10">
          <img src={logo} alt="Profile" className="rounded-full h-20 w-20" />
          <h2 className="text-lg font-semibold mt-4">I'm Admin</h2>
        </div>
        <nav className="flex flex-col space-y-4">
          <Link to="/admin/ourcourses">
            <button className="w-full bg-green-700 hover:bg-green-600 text-white py-2 rounded">
              Our Courses
            </button>
          </Link>
          <Link to="/admin/createcourse">
            <button className="w-full bg-orange-500 hover:bg-blue-600 text-white py-2 rounded">
              Create Course
            </button>
          </Link>
          <Link to="/">
            <button className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded">
              Home
            </button>
          </Link>
          <Link to="/admin/login">
            <button
              onClick={handleLogout}
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded"
            >
              Logout
            </button>
          </Link>
        </nav>
      </div>

      {/* Content Area */}
      <div className="flex flex-1 items-center justify-center p-6 text-xl font-semibold text-white bg-gradient-to-r from-black to-blue-950">
        Welcome!!!
      </div>
    </div>
  );
}

export default Dashboard;
