import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { backendUrl } from "../utils/utils";
function Ourcourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const admin = JSON.parse(localStorage.getItem("admin"));
  const token = admin?.token;

  useEffect(() => {
    if (!token) {
      toast.error("Please login to admin");
      navigate("/admin/login");
      return;
    }

    const fetchCourses = async () => {
      try {
        const response = await axios.get(`${backendUrl}/courses/course`, {
          withCredentials: true,
        });
        setCourses(response.data.data);
        setLoading(false);
      } catch (error) {
        console.log("error in fetchCourses ", error);
        setLoading(false);
      }
    };

    fetchCourses();
  }, [navigate, token]);

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(
        `${backendUrl}/courses/delete/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      toast.success(response.data.message);
      const updatedCourses = courses.filter((course) => course._id !== id);
      setCourses(updatedCourses);
    } catch (error) {
      console.log("Error in deleting course ", error);
      toast.error(error.response?.data?.message || "Error in deleting course");
    }
  };

  if (loading) {
    return <p className="text-center text-gray-500">Loading...</p>;
  }

  return (
    <div className="bg-gray-100 px-4 sm:px-6 md:px-10 py-8 space-y-6 min-h-screen">
      <h1 className="text-2xl sm:text-3xl font-bold text-center">Our Courses</h1>
      <div className="flex justify-center">
        <Link
          className="bg-orange-400 py-2 px-4 rounded-lg text-white hover:bg-orange-950 duration-300"
          to={"/admin/dashboard"}
        >
          Go to dashboard
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div key={course._id} className="bg-white shadow-md rounded-lg p-4">
            <img
              src={course?.image?.url}
              alt={course.title}
              className="h-40 w-full object-cover rounded-md"
            />

            <h2 className="text-lg sm:text-xl font-semibold mt-4 text-gray-800 break-words">
              {course.title}
            </h2>

            <p className="text-gray-600 mt-2 text-sm break-words">
              {course.description.length > 200
                ? `${course.description.slice(0, 200)}...`
                : course.description}
            </p>

            <div className="flex justify-between mt-4 text-gray-800 font-bold text-sm sm:text-base">
              <div>
                ${course.price}{" "}
                <span className="line-through text-gray-500">
                  ${Math.ceil((course.price * 100) / 90)}
                </span>
              </div>
              <div className="text-green-600 text-xs sm:text-sm mt-1">10 % off</div>
            </div>

            <div className="flex flex-col sm:flex-row justify-between gap-2 mt-4">
              <Link
                to={`/admin/updatecourse/${course._id}`}
                className="bg-orange-500 text-white py-2 px-4 rounded hover:bg-blue-600 text-center"
              >
                Update
              </Link>
              <button
                onClick={() => handleDelete(course._id)}
                className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Ourcourses;
