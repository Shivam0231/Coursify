import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaCircleUser, FaDiscourse, FaDownload } from "react-icons/fa6";
import { RiHome2Fill } from "react-icons/ri";
import { IoMdSettings } from "react-icons/io";
import { IoLogIn, IoLogOut } from "react-icons/io5";
import { FiSearch } from "react-icons/fi";
import { HiMenu, HiX } from "react-icons/hi";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { backendUrl } from "../utils/utils";
import { useAuth } from '../context/AuthContext';
const Course = () => {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [search, setSearch] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [purchasedCourses, setPurchasedCourses] = useState([]);
  const {setUser}=useAuth();
  const navigate = useNavigate();

  const dummytoken = JSON.parse(localStorage.getItem("user"));
  const token = dummytoken?.token;

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  useEffect(() => {
    setIsLoggedIn(!!token);
  }, [token]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get(
          `${backendUrl}/courses/course`,
          { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
        );
        setCourses(res.data.data);
        setFilteredCourses(res.data.data);
      } catch {
        toast.error("Failed to load courses");
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, [token]);

  const handleLogout = async () => {
    try {
      const res = await axios.get(`${backendUrl}/user/logout`, {
        withCredentials: true,
      });
      toast.success(res.data.message);
      localStorage.removeItem("user");
      setUser(null);
      setIsLoggedIn(false);
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message);
      localStorage.removeItem("user");
      navigate("/login");
    }
  };

  const handleSearch = () => {
    if (!search.trim()) return setFilteredCourses(courses);
    const filtered = courses.filter((c) =>
      c.title.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredCourses(filtered);
  };

  const handleProfileClick = async () => {
    try {
      const res = await axios.get(
        `${backendUrl}/user/purchases`,
        { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
      );
      setPurchasedCourses(res.data.datas.listcourse);
      setShowProfile(true);
    } catch {
      toast.error("Login to see details");
    }
  };

  return (
    <div className="flex">
      {/* Sidebar toggle */}
      <button
        className="fixed top-4 left-4 z-20 text-3xl md:hidden"
        onClick={toggleSidebar}
      >
        {isSidebarOpen ? <HiX /> : <HiMenu />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 w-64 p-5 bg-gray-100 z-10 transform transition-transform duration-300 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        <div className="mb-10">
          <img
            src="/shivam.jpeg"
            alt="Profile"
            className="h-12 w-12 rounded-full mx-auto md:mx-0"
          />
        </div>
        <nav className="space-y-4">
          <Link to="/" className="flex items-center">
            <RiHome2Fill className="mr-2" /> Home
          </Link>
          <Link to="/courses" className="flex items-center text-blue-500">
            <FaDiscourse className="mr-2" /> Courses
          </Link>
          <Link to="/purchases" className="flex items-center">
            <FaDownload className="mr-2" /> Purchases
          </Link>
          <Link to="/settings" className="flex items-center">
            <IoMdSettings className="mr-2" /> Settings
          </Link>
          {isLoggedIn ? (
            <button onClick={handleLogout} className="flex items-center">
              <IoLogOut className="mr-2" /> Logout
            </button>
          ) : (
            <Link to="/login" className="flex items-center">
              <IoLogIn className="mr-2" /> Login
            </Link>
          )}
        </nav>
      </aside>

      {/* Main section */}
      <main className="ml-0 md:ml-64 w-full p-6 bg-white min-h-screen">
        {/* Header */}
        <header className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
          <h1 className="text-2xl font-bold">Courses</h1>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search courses..."
              className="border-gray-300 h-10 px-4 rounded-l-full w-full sm:w-auto focus:outline-none"
            />
            <button
              onClick={handleSearch}
              className="h-10 px-4 bg-gray-100 rounded-r-full hover:bg-gray-200"
            >
              <FiSearch className="text-xl text-gray-600" />
            </button>
            <FaCircleUser
              className="text-4xl text-blue-600 cursor-pointer"
              onClick={handleProfileClick}
            />
          </div>
        </header>

        {/* Back button */}
        {search.trim() !== "" && (
          <div className="flex justify-center my-4">
            <button
              onClick={() => {
                setSearch("");
                setFilteredCourses(courses);
              }}
              className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-full"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back to All Courses
            </button>
          </div>
        )}

        {/* Courses Grid or No Results */}
        <div className="overflow-y-auto h-[75vh]">
          {loading ? (
            <p className="text-center text-gray-500">Loading...</p>
          ) : filteredCourses.length === 0 ? (
            <p className="text-center text-gray-500">Course not found</p>
          ) : (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
              {filteredCourses.map((course) => (
                <div
                  key={course._id}
                  className="p-4 border rounded-lg shadow-sm"
                >
                  <img
                    src={course.image.url}
                    alt={course.title}
                    className="h-40 w-full object-cover rounded mb-4"
                  />
                  <h2 className="font-bold text-lg mb-2">{course.title}</h2>
                  <p className="text-gray-600 mb-4">
                    {course.description.length > 100
                      ? `${course.description.slice(0, 100)}...`
                      : course.description}
                  </p>
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-bold text-xl">
                      ${course.price}{" "}
                      <span className="text-gray-500 line-through">
                        ${Math.ceil((course.price * 100) / 80)}
                      </span>
                    </span>
                    <span className="text-green-600">20% off</span>
                  </div>
                  <Link
                    to={`/buy/${course._id}`}
                    className="block text-center bg-orange-500 text-white py-2 rounded-lg hover:bg-blue-900"
                  >
                    Buy Now
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Profile Popup */}
        {showProfile && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
            <div className="relative bg-white w-[90%] md:w-[40%] p-6 rounded-lg shadow-xl">
              <button
                className="absolute top-2 right-4 text-xl text-gray-500 hover:text-black"
                onClick={() => setShowProfile(false)}
              >
                ✕
              </button>
              <h2 className="text-2xl font-bold mb-4">User Details</h2>
              <p>
                <strong>First Name:</strong> {dummytoken.user.firstname}
              </p>
              <p>
                <strong>Last Name:</strong> {dummytoken.user.lastname}
              </p>
              <p>
                <strong>Email:</strong> {dummytoken.user.email}
              </p>
              <h3 className="mt-4 font-semibold">Courses Enrolled:</h3>
              <ul className="list-disc pl-5 max-h-40 overflow-y-auto mt-2 text-gray-600">
                {purchasedCourses.length > 0 ? (
                  purchasedCourses.map((c) => <li key={c._id}>{c.title}</li>)
                ) : (
                  <p className="text-sm">No courses enrolled</p>
                )}
              </ul>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Course;
