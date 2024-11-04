import React, { createContext, useContext, useState, useEffect } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  addDoc,
  onSnapshot
} from "firebase/firestore";
import { auth, db } from '../firebase.config';
import { onAuthStateChanged } from "firebase/auth";
import toast from "react-hot-toast";

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        loadCartItems(currentUser.uid);
      } else {
        setCartItems([]);
      }
    });
    return unsubscribe;
  }, []);

  const loadCartItems = (uid) => {
    const q = query(collection(db, "carts"), where("uid", "==", uid));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const items = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCartItems(items);
    });
    return unsubscribe;
  };

  const addToCart = async (product) => {
    if (!user) {
      toast.error("Please log in to add items to the cart.");
      return;
    }

    const q = query(
      collection(db, "carts"),
      where("uid", "==", user.uid),
      where("productId", "==", product.id)
    );
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      await addDoc(collection(db, "carts"), {
        uid: user.uid,
        productId: product.id,
        name: product.Name,
        price: product.Price,
        quantity: 1,
        image: product.Picture,
      });
      toast.success("Product added to cart!");
    }
  };

  const removeFromCart = async (productId) => {
    if (!user) return;

    const q = query(
      collection(db, "carts"),
      where("uid", "==", user.uid),
      where("productId", "==", productId)
    );
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      await deleteDoc(querySnapshot.docs[0].ref);
      toast.error("Product removed from cart.");
    }
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};
