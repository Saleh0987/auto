import React, { useState, useEffect } from 'react';
import { collection, addDoc, query, where, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../firebase.config'; // Adjust the path as needed
import { onAuthStateChanged } from 'firebase/auth';

const Address = () => {
  const [user, setUser] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [buildingNumber, setBuildingNumber] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        fetchAddresses(user.uid);
      } else {
        setUser(null);
        setAddresses([]);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchAddresses = async (uid) => {
    try {
      const q = query(collection(db, 'addresses'), where('uid', '==', uid));
      const querySnapshot = await getDocs(q);
      const addresses = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAddresses(addresses);
    } catch (error) {
      console.error('Error fetching addresses:', error);
    }
  };

  const handleAddOrUpdateAddress = async () => {
    if (!address || !city || !phoneNumber || !buildingNumber) {
      setError('All fields are required');
      return;
    }

    try {
      if (editingId) {
        // Update existing address
        await updateDoc(doc(db, 'addresses', editingId), {
          address,
          city,
          phoneNumber,
          buildingNumber,
          email: user.email // Add user's email on update
        });
        setEditingId(null); // Reset editingId
      } else {
        // Add new address
        await addDoc(collection(db, 'addresses'), {
          uid: user.uid,
          address,
          city,
          phoneNumber,
          buildingNumber,
          isPrimary: false, // Set default to not primary
          email: user.email // Add user's email when adding a new address
        });
      }

      // Clear fields
      setAddress('');
      setCity('');
      setPhoneNumber('');
      setBuildingNumber('');
      setError(null);
      fetchAddresses(user.uid); // Refresh addresses after adding/updating

      // Check if there is only one address and set it as primary
      const addressesSnapshot = await getDocs(query(collection(db, 'addresses'), where('uid', '==', user.uid)));
      if (addressesSnapshot.size === 1) {
        const singleAddressId = addressesSnapshot.docs[0].id; // Get the ID of the only address
        await updateDoc(doc(db, 'addresses', singleAddressId), { isPrimary: true });
        fetchAddresses(user.uid); // Refresh addresses again after setting primary
      }
    } catch (error) {
      console.error('Error adding/updating address:', error);
    }
  };

  const handleEditAddress = (id, address, city, phoneNumber, buildingNumber) => {
    setEditingId(id);
    setAddress(address);
    setCity(city);
    setPhoneNumber(phoneNumber);
    setBuildingNumber(buildingNumber);
  };

  const handleDeleteAddress = async (id) => {
    const addressesSnapshot = await getDocs(query(collection(db, 'addresses'), where('uid', '==', user.uid)));
    if (addressesSnapshot.size > 1) {
      try {
        await deleteDoc(doc(db, 'addresses', id));
        fetchAddresses(user.uid); // Refresh addresses after deleting
      } catch (error) {
        console.error('Error deleting address:', error);
      }
    } else {
      console.warn('Cannot delete the only address');
    }
  };

  const handleSetPrimaryAddress = async (id) => {
    try {
      // Update all addresses to not primary
      const addressesRef = collection(db, 'addresses');
      const querySnapshot = await getDocs(query(addressesRef, where('uid', '==', user.uid)));
      const updates = querySnapshot.docs.map(doc => updateDoc(doc.ref, { isPrimary: false }));

      await Promise.all(updates); // Set all addresses to not primary

      // Set the selected address as primary
      await updateDoc(doc(db, 'addresses', id), { isPrimary: true });
      fetchAddresses(user.uid); // Refresh addresses after setting primary
    } catch (error) {
      console.error('Error setting primary address:', error);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-4">
      <h1 className="text-3xl font-bold text-white text-center mb-6">Manage Addresses</h1>
      {error && <p className="text-red-500 text-center">{error}</p>}
      
      <div className="grid gap-4 mb-6">
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Enter Address"
          className="border border-gray-300 rounded p-2 w-full"
        />
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter City"
          className="border border-gray-300 rounded p-2 w-full"
        />
        <input
          type="text"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          placeholder="Enter Phone Number"
          className="border border-gray-300 rounded p-2 w-full"
        />
        <input
          type="text"
          value={buildingNumber}
          onChange={(e) => setBuildingNumber(e.target.value)}
          placeholder="Enter Building Number"
          className="border border-gray-300 rounded p-2 w-full"
        />
        <button 
          onClick={handleAddOrUpdateAddress}
          className="bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-200"
        >
          {editingId ? 'Update Address' : 'Add Address'}
        </button>
      </div>

      <ul className="list-none">
        {addresses.map(({ id, address, city, phoneNumber, buildingNumber, isPrimary }) => (
          <li key={id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 p-4 border border-gray-300 rounded shadow">
            <span className={`text-gray-700 ${isPrimary ? 'font-bold' : ''}`}>
              {address}, {city}, {phoneNumber}, {buildingNumber} {isPrimary && '(Primary)'}
            </span>
            <div className="flex flex-col sm:flex-row mt-2 sm:mt-0">
              <button 
                onClick={() => handleEditAddress(id, address, city, phoneNumber, buildingNumber)}
                className="bg-yellow-500 text-white py-1 px-2 rounded hover:bg-yellow-600 transition duration-200 mr-2 mb-2 sm:mb-0"
              >
                Edit
              </button>
              <button 
                onClick={() => handleDeleteAddress(id)}
                className={`bg-red-500 text-white py-1 px-2 rounded hover:bg-red-600 transition duration-200 mb-2 sm:mb-0 ${addresses.length === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={addresses.length === 1} // Disable delete button if only one address
              >
                Delete
              </button>
              <button 
                onClick={() => handleSetPrimaryAddress(id)}
                className={`bg-green-500 text-white py-1 px-2 rounded hover:bg-green-600 transition duration-200 ${isPrimary ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={isPrimary} // Disable if already primary
              >
                {isPrimary ? 'Primary Address' : 'Set as Primary'}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Address;
