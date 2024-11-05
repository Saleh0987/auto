import React, { useState, useRef, useEffect } from 'react';
import useAuth from '../custom-hooks/useAuth';
import { updateProfile } from 'firebase/auth'; 
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage, auth, db } from '../firebase.config';
import toast from 'react-hot-toast';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { Link } from 'react-router-dom';

const Profile = () => {
  const { currentUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(currentUser.displayName || '');
  const [photoURL, setPhotoURL] = useState(currentUser.photoURL || '');
  const [imageFile, setImageFile] = useState(null);
  const uploadTaskRef = useRef(null);
  const [primaryAddress, setPrimaryAddress] = useState(null);

  useEffect(() => {
    const fetchPrimaryAddress = async () => {
      if (!currentUser || !currentUser.uid) return;

      try {
        const q = query(
          collection(db, 'addresses'), 
          where('uid', '==', currentUser.uid), 
          where('isPrimary', '==', true)
        );
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const addressData = querySnapshot.docs[0].data();
          setPrimaryAddress(addressData);
        } else {
          setPrimaryAddress(null);
        }
      } catch (error) {
        console.error('Error fetching primary address:', error);
        toast.error('Failed to fetch primary address.');
      }
    };

    fetchPrimaryAddress();
  }, [currentUser]);

  const handleNameChange = (e) => setName(e.target.value);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (uploadTaskRef.current) {
        uploadTaskRef.current.cancel();
      }

      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setPhotoURL(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updates = {};

    if (name && name !== currentUser.displayName) {
      updates.displayName = name;
    }

    if (imageFile) {
      const storageRef = ref(storage, `images/${Date.now()}_${imageFile.name}`);
      const uploadTask = uploadBytesResumable(storageRef, imageFile);
      uploadTaskRef.current = uploadTask;

      const toastId = toast.loading('Uploading...');

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          toast.loading(`Uploading... ${Math.round(progress)}%`, { id: toastId });
        },
        (error) => {
          console.error('Error uploading image:', error);
          toast.dismiss(toastId);
          toast.error('Error uploading image.');
        },
        async () => {
          const newPhotoURL = await getDownloadURL(uploadTask.snapshot.ref);
          updates.photoURL = newPhotoURL;

          toast.dismiss(toastId);
          await updateProfileAndHandleResponse(updates);
        }
      );
    } else if (Object.keys(updates).length > 0) {
      await updateProfileAndHandleResponse(updates);
    } else {
      toast.error('No changes detected.');
    }
  };

  const updateProfileAndHandleResponse = async (updates) => {
    try {
      await updateProfile(auth.currentUser, updates);
      toast.success('Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Error updating profile.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-6  min-h-screen">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <div className="flex flex-col items-center">
          <img
            src={photoURL || currentUser.photoURL}
            alt={name}
            className="w-32 h-32 rounded-full object-cover mb-4 shadow-md border-4 border-blue-500"
          />
          {!isEditing ? (
            <>
              <h2 className="text-3xl font-bold text-center">{currentUser.displayName}</h2>
              <p className="text-gray-500 text-center">{currentUser.email}</p>
              <h3 className="text-lg font-semibold text-center mt-4">Primary Address</h3>
              {primaryAddress ? (
                <p className="text-gray-700 text-center">
                  {primaryAddress.address}, {primaryAddress.city}, {primaryAddress.phoneNumber}, {primaryAddress.buildingNumber}
                </p>
              ) : (
                <p className="text-gray-400 text-center">No primary address set.</p>
              )}
              <button
                onClick={() => setIsEditing(true)}
                className="mt-4 bg-blue-500 text-white py-2 px-6 rounded-lg shadow-lg hover:bg-blue-600 transition duration-300"
              >
                Edit Profile
              </button>
            </>
          ) : (
            <form onSubmit={handleSubmit} className="w-full flex flex-col items-center">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="mb-4 border border-gray-300 rounded-lg p-2 w-full"
              />
              <input
                type="text"
                value={name}
                onChange={handleNameChange}
                placeholder="Enter your name"
                className="border border-gray-300 p-2 rounded-lg mb-4 w-full"
              />
              <button
                type="submit"
                className="bg-green-500 text-white py-2 px-6 rounded-lg shadow-lg hover:bg-green-600 transition duration-300 w-full"
              >
                Update Profile
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setName(currentUser.displayName || '');
                  setPhotoURL(currentUser.photoURL || '');
                }}
                className="mt-2 bg-gray-300 text-black py-2 px-6 rounded-lg shadow-lg hover:bg-gray-400 transition duration-300 w-full"
              >
                Cancel
              </button>
            </form>
          )}
        </div>
      </div>
      <Link to={'/address'} className="mt-4 text-blue-500 hover:underline">
        Manage Addresses
      </Link>
    </div>
  );
};

export default Profile;