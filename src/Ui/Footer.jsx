import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-gray-800 to-gray-900 text-white py-10">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="flex flex-col items-center justify-center text-center">
          <a href="#" className="text-2xl font-bold mb-2 flex items-center">
            <i className="ri-steering-line mr-2" /> AUTO
          </a>
          <p className="text-gray-300 mb-4">
            We offer the best electric cars of <br />
            the most recognized brands in <br />
            the world.
          </p>
          <div className="flex space-x-4">
            <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-blue-600">
              <i className="ri-facebook-fill text-xl" />
            </a>
            <a href="https://www.linkedin.com/" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-blue-600">
              <i className="ri-linkedin-fill text-xl" />
            </a>
            <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-blue-600">
              <i className="ri-twitter-fill text-xl" />
            </a>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center text-center">
          <h3 className="text-lg font-semibold mb-2">Company</h3>
          <ul className="space-y-2">
            <li><a href="#" className="text-gray-300 hover:underline">About</a></li>
            <li><a href="#" className="text-gray-300 hover:underline">Cars</a></li>
            <li><a href="#" className="text-gray-300 hover:underline">History</a></li>
            <li><a href="#" className="text-gray-300 hover:underline">Shop</a></li>
          </ul>
        </div>
        <div className="flex flex-col items-center justify-center text-center">
          <h3 className="text-lg font-semibold mb-2">Information</h3>
          <ul className="space-y-2">
            <li><a href="#" className="text-gray-300 hover:underline">Request a quote</a></li>
            <li><a href="#" className="text-gray-300 hover:underline">Find a dealer</a></li>
            <li><a href="#" className="text-gray-300 hover:underline">Contact us</a></li>
            <li><a href="#" className="text-gray-300 hover:underline">Services</a></li>
          </ul>
        </div>
        <div className="flex flex-col items-center justify-center text-center">
          <h3 className="text-lg font-semibold mb-2">Subscribe to our Newsletter</h3>
          <form className="flex flex-col space-y-2">
            <input type="email" placeholder="Your email address" className="px-3 py-2 rounded bg-gray-700 
            text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600" />
            <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white 
            py-2 rounded transition duration-200">Subscribe</button>
          </form>
        </div>
      </div>
      <span className="block text-center text-gray-400 mt-6">
        © El-Saleh. 2024. All rights reserved
      </span>
    </footer>
  );
};

export default Footer;