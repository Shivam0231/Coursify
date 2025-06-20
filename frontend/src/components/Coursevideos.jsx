import React from 'react';
import { Link } from 'react-router-dom';

const videos = [
  "https://www.youtube.com/embed/mlIUKyZIUUU",
  "https://www.youtube.com/embed/e7sAf4SbS_g",
  "https://www.youtube.com/embed/2oGsCHlfBUg",
  "https://www.youtube.com/embed/vLqTf2b6GZw",
  "https://www.youtube.com/embed/cOcsecRATdc",
  "https://www.youtube.com/embed/OkS9YkfW50s",
  "https://www.youtube.com/embed/3obEP8eLsCw",
  "https://www.youtube.com/embed/q3Z3Qa1UNBA",
  "https://www.youtube.com/embed/dl00fOOYLOM",
  "https://www.youtube.com/embed/VlPiVmYuoqw",
  "https://www.youtube.com/embed/lGg3VF2RScI",
  "https://www.youtube.com/embed/fNzpcB7ODxQ",
  "https://www.youtube.com/embed/Rzzi_CGMIHc",
  "https://www.youtube.com/embed/RGKi6LSPDLU",
  "https://www.youtube.com/embed/tvpGsBOUK-0",
];

const CourseVideos = () => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-black to-blue-950 text-white p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl text-orange-500 font-bold">Course Videos</h1>
        <Link
          to="/"
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition"
        >
          ← Back to Home
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {videos.map((src, index) => (
          <div key={index} className="w-full aspect-video">
            <iframe
              className="w-full h-full rounded-lg shadow-lg"
              src={src}
              title={`Course Video ${index + 1}`}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseVideos;
