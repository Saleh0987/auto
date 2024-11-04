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
    // Check if currentUser and its uid are defined
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
        setPrimaryAddress(null); // Reset if no primary address found
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
    <div className="flex flex-col items-center justify-center p-6">
      <div className="bg-white rounded-lg shadow-md p-4 w-full max-w-md">
        <img
          src={photoURL || currentUser.photoURL} 
          alt={name}
          className="w-32 h-32 rounded-full object-contain mx-auto mb-4"
        />
        {!isEditing ? (
          <>
            <h2 className="text-xl font-semibold text-center">{currentUser.displayName}</h2>
            <p className="text-gray-500 text-center">{currentUser.email}</p>
            <h3 className="text-lg font-semibold text-center mt-4">Primary Address</h3>
            {primaryAddress ? (
              <p className="text-gray-700 text-center">
                {primaryAddress.address}, {primaryAddress.city}, {primaryAddress.phoneNumber}, {primaryAddress.buildingNumber}
              </p>
            ) : (
              <p className="text-gray-500 text-center">No primary address set.</p>
            )}
            <button
              onClick={() => setIsEditing(true)}
              className="mt-4 bg-blue-500 text-white p-2 rounded"
            >
              Edit
            </button>
          </>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col items-center">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="mb-4"
            />
            <input
              type="text"
              value={name}
              onChange={handleNameChange}
              placeholder="Enter your name"
              className="border p-2 rounded mb-4 w-full"
            />
            <button
              type="submit"
              className="bg-blue-500 text-white p-2 rounded w-full"
            >
              Update Profile
            </button>
            <button
              type="button"
              onClick={() => {
                setIsEditing(false);
                setName(currentUser.displayName || ''); // Reset to original name
                setPhotoURL(currentUser.photoURL || ''); // Reset to original photo
              }}
              className="mt-2 bg-gray-300 text-black p-2 rounded w-full"
            >
              Cancel
            </button>
          </form>
        )}
      </div>
      <Link to={'/address'} className="mt-4 text-blue-500">
        Manage Addresses
      </Link>
    </div>
  );
};

export default Profile;
