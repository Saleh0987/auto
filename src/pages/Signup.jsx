import React, { useState } from 'react';
import Helmet from '../components/Helmet/Helmet.jsx';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { setDoc, doc } from 'firebase/firestore';
import { storage, db, auth } from '../firebase.config';
import Loader from '../Ui/Loader.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import toast from 'react-hot-toast';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState(''); // New state for success message
  const navigate = useNavigate();

  const validateUsername = (value) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z]).+$/;
    return regex.test(value);
  };

  const validatePassword = (value) => value.length >= 10;

  const signup = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!validateUsername(username)) {
        toast.error('Username must contain at least one uppercase and one lowercase letter.');
        setLoading(false);
        return;
      }

      if (!validatePassword(password)) {
        toast.error('Password must be at least 10 characters long.');
        setLoading(false);
        return;
      }

      if (!file) {
        toast.error('Please upload an image.');
        setLoading(false);
        return;
      }

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const storageRef = ref(storage, `images/${Date.now() + username}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        'state_changed',
        null,
        (error) => {
          toast.error(error.message);
        },
        async () => {
          const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
          await updateProfile(user, {
            displayName: username,
            photoURL: downloadUrl,
          });

          await setDoc(doc(db, 'users', user.uid), {
            uid: user.uid,
            displayName: username,
            email,
            photoURL: downloadUrl,
          });

          setLoading(false);
          setSuccessMessage(`Account Created! Welcome, ${username}!`); // Set success message
          toast.success('Account Created');
          navigate('/'); // Optionally, navigate after a delay or based on user choice
        }
      );
    } catch (error) {
      setLoading(false);
      if (error.code === 'auth/email-already-in-use') {
        toast.error('This email is already registered.');
      } else {
        toast.error('Something went wrong');
      }
    }
  };

  const togglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <Helmet title='Signup'>
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        {loading ? (
          <div className="text-center h-100">
            <Loader />
          </div>
        ) : (
          <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-center text-gray-900">Sign Up</h2>
            <form className="mt-8 space-y-6" onSubmit={signup}>
              <div className="rounded-md shadow-sm">
                <div className="mb-4">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    User Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-3 py-2 mt-1 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="your username"
                    autoComplete="username"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email Address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 mt-1 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="you@example.com"
                    autoComplete="email"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-3 py-2 mt-1 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="********"
                      autoComplete="new-password"
                    />
                    <button type="button" onClick={togglePassword} className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-700">
                      <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                    </button>
                  </div>
                </div>
                <div className="mb-4">
                  <label htmlFor="file" className="block text-sm font-medium text-gray-700">
                    Upload Image
                  </label>
                  <input
                    id="file"
                    name="file"
                    type="file"
                    onChange={(e) => setFile(e.target.files[0])}
                    className="w-full px-3 py-2 mt-1 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    autoComplete="off"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Create an account
                </button>
              </div>

              {successMessage && ( // Conditionally render success message
                <p className="text-center text-green-600 mt-4">{successMessage}</p>
              )}

              <p className="text-center">
                Already have an account? <Link to='/login' className="text-indigo-600 hover:underline">Login</Link>
              </p>
            </form>
          </div>
        )}
      </div>
    </Helmet>
  );
};

export default Signup;
