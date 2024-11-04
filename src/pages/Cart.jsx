import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../firebase.config';
import { onAuthStateChanged } from 'firebase/auth';
import { AiOutlineMinus, AiOutlinePlus, AiFillDelete } from 'react-icons/ai';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    const fetchCartItems = async () => {
      if (user) {
        const q = query(collection(db, 'carts'), where('uid', '==', user.uid));
        const querySnapshot = await getDocs(q);
        const items = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setCartItems(items);
      }
    };
    fetchCartItems();
  }, [user]);

  const increaseQuantity = async (item) => {
    const itemRef = doc(db, 'carts', item.id);
    await updateDoc(itemRef, { quantity: item.quantity + 1 });
    setCartItems(cartItems.map((i) => (i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i)));
  };

  const decreaseQuantity = async (item) => {
    if (item.quantity > 1) {
      const itemRef = doc(db, 'carts', item.id);
      await updateDoc(itemRef, { quantity: item.quantity - 1 });
      setCartItems(cartItems.map((i) => (i.id === item.id ? { ...i, quantity: i.quantity - 1 } : i)));
    } else {
      handleRemoveFromCart(item.id);
    }
  };

  const handleRemoveFromCart = async (itemId) => {
    await deleteDoc(doc(db, 'carts', itemId));
    setCartItems(cartItems.filter((item) => item.id !== itemId));
  };

  const totalPrice = cartItems.reduce((total, item) => {
    const price = parseFloat(item.price) || 0;
    const quantity = item.quantity || 0;
    return total + price * quantity;
  }, 0).toFixed(2);

  return (
    <div className="min-h-screen p-6 flex flex-col items-center">
      <h2 className="text-4xl font-bold mb-8 text-white">Your Cart</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 container mx-auto">
        {cartItems.length > 0 ? (
          cartItems.map((item) => {
            const price = parseFloat(item.price) || 0;
            const quantity = item.quantity || 0;
            const total = (price * quantity).toFixed(2);

            return (
              <div key={item.id} className="bg-white shadow-lg rounded-lg p-4 flex flex-col">
                <img src={item.image} alt={item.name} className="w-full h-32 object-contain rounded-md mb-4" />
                <h4 className="text-xl font-semibold mb-2">{item.name}</h4>
                <div className='flex items-center flex-wrap justify-between'>
                <p className="text-lg text-indigo-600 font-bold mb-2">${price.toFixed(2)}</p>
                <p className="text-gray-600 mb-2">Total: ${total}</p>
                </div>
                <div className="flex items-center justify-center mt-auto">
                  <div className="flex items-center">
                    <button onClick={() => decreaseQuantity(item)} className="p-2 bg-gray-200 rounded-l-md hover:bg-gray-300">
                      <AiOutlineMinus />
                    </button>
                    <span className="border-t border-b border-gray-300 px-4">{quantity}</span>
                    <button onClick={() => increaseQuantity(item)} className="p-2 bg-gray-200 rounded-r-md hover:bg-gray-300">
                      <AiOutlinePlus />
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-center mt-3">
                <div className="flex items-center w-full">
                  <button 
                    onClick={() => handleRemoveFromCart(item.id)}
                      className="flex items-center justify-center w-full py-2 text-white bg-red-600 hover:bg-red-700 
                    transition-colors duration-300 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-red-500">
                    <AiFillDelete className="mr-2" /> Remove
                  </button>
                </div>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-gray-500 text-center col-span-full">Your cart is empty.</p>
        )}
      </div>
      {cartItems.length > 0 && (
        <div className="w-max-2xl mx-auto mt-6 flex items-center justify-center flex-col bg-white shadow-lg rounded-lg p-6">
          <h3 className="text-2xl font-semibold">Total Price: ${totalPrice}</h3>
          <button className="mt-4 w-50 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition">
            Proceed to Checkout
          </button>
        </div>
      )}
    </div>
  );
};

export default Cart;