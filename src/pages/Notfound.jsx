import React from 'react';
import { Link } from 'react-router-dom';

const Notfound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-800 to-gray-900 p-6">
      <div className="bg-white rounded-lg shadow-lg p-10 text-center">
        <h1 className="text-8xl font-extrabold text-blue-500 mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-6">Oops! Page Not Found</p>
        <Link 
          to="/" 
          className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow transition duration-200 hover:bg-blue-600 hover:shadow-lg"
        >
          Go Home
        </Link>
      </div>
      <div className="mt-10 text-gray-400 text-sm">
        <p>© {new Date().getFullYear()} ElSaleh. All rights reserved.</p>
      </div>
    </div>
  );
}

export default Notfound;
