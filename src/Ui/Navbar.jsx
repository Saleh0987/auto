import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { collection, query, where, getDocs, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../firebase.config';
import useAuth from '../custom-hooks/useAuth';
import { FiMenu, FiX, FiHeart, FiShoppingCart } from 'react-icons/fi';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  // Toggle mobile menu
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

useEffect(() => {
  let unsubscribe; // Define an unsubscribe variable to handle cleanup

  const fetchCartCount = () => {
    if (currentUser && currentUser.uid) { // Ensure currentUser and uid are defined
      try {
        const q = query(collection(db, 'carts'), where('uid', '==', currentUser.uid));
        unsubscribe = onSnapshot(q, (querySnapshot) => {
          setCartCount(querySnapshot.size); // Update the cart count in real-time
        });
      } catch (error) {
        console.error("Error setting up cart count listener:", error);
      }
    }
  };

  fetchCartCount();

  // Clean up the listener on component unmount
  return () => {
    if (unsubscribe) unsubscribe();
  };
}, [currentUser]);

  // Logout handler
  const logout = () => {
    if (window.confirm('Are you sure you want to log out?')) {
      signOut(auth)
        .then(() => {
          toast.success('Logged out');
          navigate('/login');
        })
        .catch(err => toast.error(err.message));
    }
  };

  return (
    <nav className="bg-white shadow-lg p-2 relative z-50 bg-gradient-to-r from-gray-800 to-gray-900">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to={currentUser ? "/" : '/signup'} className="text-xl font-bold text-white">AUTO</Link>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            {currentUser && (
              <>
                <NavLink to="/" className="text-white hover:text-indigo-600 px-3 py-2 rounded-md text-md">Home</NavLink>
                <NavLink to="/about" className="text-white hover:text-indigo-600 px-3 py-2 rounded-md text-md">About</NavLink>
                <NavLink to="/services" className="text-white hover:text-indigo-600 px-3 py-2 rounded-md text-md">Services</NavLink>
                <NavLink to="/contact" className="text-white hover:text-indigo-600 px-3 py-2 rounded-md text-md">Contact</NavLink>
                <NavLink to="/profile" className="text-white hover:text-indigo-600 px-3 py-2 rounded-md text-md">Profile</NavLink>
                <NavLink to="/favorites" className="text-white hover:text-indigo-600 px-3 py-2 rounded-md text-md">
                  <FiHeart className="h-6 w-6" />
                </NavLink>
                <NavLink to="/cart" className="text-white hover:text-indigo-600 px-3 py-2 rounded-md text-md relative">
                  <FiShoppingCart className="h-6 w-6" />
                  {cartCount > 0 && (
                    <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </NavLink>
                <button onClick={logout} className="text-white hover:text-black bg-red-700 px-3 py-2 rounded-md text-md">Logout</button>
              </>
            )}
          </div>
          {currentUser && (
          <div className="-mr-2 flex md:hidden">
            <button
              type="button"
              onClick={toggleMenu}
              className="text-white hover:text-indigo-600 inline-flex items-center justify-center p-2 rounded-md focus:outline-none"
            >
              {isOpen ? (
                <FiX className="h-6 w-6" />
              ) : (
                <FiMenu className="h-6 w-6" />
              )}
            </button>
          </div>
            )}
        </div>
      </div>

      {currentUser && isOpen && (
        <>
          <div className="fixed inset-0 cursor-pointer" onClick={toggleMenu}></div>
          <div className="absolute top-50 left-0 right-0 z-50 bg-gradient-to-r from-gray-800 to-gray-900 md:hidden">
            <div className="px-2 pt-2 pb-3 flex justify-center items-center flex-col space-y-1 sm:px-3">
              <NavLink to="/" className="text-white hover:text-indigo-600 block px-3 py-2 rounded-md text-base font-medium">Home</NavLink>
              <NavLink to="/about" className="text-white hover:text-indigo-600 block px-3 py-2 rounded-md text-base font-medium">About</NavLink>
              <NavLink to="/services" className="text-white hover:text-indigo-600 block px-3 py-2 rounded-md text-base font-medium">Services</NavLink>
              <NavLink to="/contact" className="text-white hover:text-indigo-600 block px-3 py-2 rounded-md text-base font-medium">Contact</NavLink>
              <NavLink to="/profile" className="text-white hover:text-indigo-600 block px-3 py-2 rounded-md text-base font-medium">Profile</NavLink>
              <NavLink to="/favorites" className="text-white hover:text-black block w-[120px] text-center px-3 py-2 bg-green-500 rounded-md text-base font-medium">Favorites</NavLink>
              <NavLink to="/cart" className="text-black hover:text-black block w-[120px] text-center px-7 py-2 bg-red-500 rounded-md text-base font-medium relative">
                Cart
                {cartCount > 0 && (
                  <span className="absolute top-0 bottom-1 right-0 bg-white text-black text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </NavLink>
              <button onClick={logout} className="text-white hover:text-indigo-600 block px-3 py-2 rounded-md text-base font-medium">Logout</button>
            </div>
          </div>
        </>
      )}
    </nav>
  );
};

export default Navbar;
