import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { backendUrl } from "../utils/utils";
const Setting = () => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState("");
  const [purchaseCount, setPurchaseCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    setUser(userData);
    setToken(userData?.token || "");
    setFirstname(userData?.user?.firstname || "");
    setLastname(userData?.user?.lastname || "");
    setEmail(userData?.user?.email || "");
  }, []);

  useEffect(() => {
    if (!token) return;

    const fetchPurchases = async () => {
      try {
        const res = await axios.get(`${backendUrl}/user/purchases`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });

        const count = res?.data?.datas?.listcourse?.length || 0;
        setPurchaseCount(count);
      } catch (error) {
        console.error("Error fetching purchases:", error);
        setPurchaseCount(0);
      } finally {
        setLoading(false);
      }
    };

    fetchPurchases();
  }, [token]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await axios.post(
        `${backendUrl}/user/update/0`,
        { firstname, lastname, email, password },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      toast.success("All fields updated successfully!");

      const updatedUser = {
        ...user,
        user: {
          ...user.user,
          firstname,
          lastname,
          email,
        },
      };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      window.location.reload();
    } catch (err) {
      console.error("Update failed", err);
      setError(err?.response?.data?.message || "Update failed.");
    }
  };

  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete your account?");
    if (!confirmDelete) return;

    try {
      await axios.post(
        `${backendUrl}/user/update/1`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      toast.success("Account deleted successfully.");
      localStorage.removeItem("user");
      window.location.href = "/";
    } catch (error) {
      console.error("Error deleting account:", error);
      toast.error("Account deletion failed.");
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-r from-black to-blue-950 text-white text-center">
        <h1 className="text-3xl font-bold mb-4">Please login to view settings</h1>
        <Link
          to="/login"
          className="bg-green-500 hover:bg-green-600 px-6 py-2 rounded text-white text-lg"
        >
          Login
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-black to-blue-950 p-4 sm:p-6 text-white">
      <div className="max-w-full sm:max-w-lg md:max-w-xl lg:max-w-2xl mx-auto bg-gray-900 p-4 sm:p-6 md:p-8 rounded-lg shadow-lg mt-10">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-orange-500 mb-6 text-center sm:text-left">
          Account Settings
        </h2>

        {/* User Info */}
        <div className="space-y-3 text-sm sm:text-base md:text-lg mb-6">
          <p><strong>👤 First Name:</strong> {user?.user?.firstname || "N/A"}</p>
          <p><strong>👤 Last Name:</strong> {user?.user?.lastname || "N/A"}</p>
          <p><strong>📧 Email:</strong> {user?.user?.email || "N/A"}</p>
          <p><strong>🎓 Courses Enrolled:</strong> {loading ? "Loading..." : purchaseCount}</p>
        </div>

        {/* Show Error */}
        {error && <div className="mb-4 text-red-500 text-sm">{error}</div>}

        {/* Update Form */}
        <form onSubmit={handleUpdate} className="space-y-4">
          <input
            value={firstname}
            onChange={(e) => setFirstname(e.target.value)}
            placeholder="New First Name"
            className="w-full p-2 rounded bg-gray-800 text-white"
          />
          <input
            value={lastname}
            onChange={(e) => setLastname(e.target.value)}
            placeholder="New Last Name"
            className="w-full p-2 rounded bg-gray-800 text-white"
          />
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="New Email"
            className="w-full p-2 rounded bg-gray-800 text-white"
          />
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="New Password"
            type="password"
            className="w-full p-2 rounded bg-gray-800 text-white"
          />
          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 p-2 rounded-md text-sm sm:text-base"
          >
            ✅ Update All Fields
          </button>
        </form>

        {/* Delete Account */}
        <button
          className="w-full bg-red-600 hover:bg-red-700 mt-4 p-2 rounded-md text-sm sm:text-base"
          onClick={handleDeleteAccount}
        >
          🗑️ Delete Account
        </button>
      </div>
    </div>
  );
};

export default Setting;
