import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Loader from '../Ui/Loader';
import { useCart } from '../context/CartContext';
import RelatedProducts from '../components/RelatedProducts';

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingCartAction, setLoadingCartAction] = useState(false);
  const { cartItems, addToCart, removeFromCart } = useCart();
  const inCart = cartItems.some((item) => item.productId === parseInt(id));

  useEffect(() => {
    const fetchProductDetails = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get('https://backend-end.vercel.app/products');
        const product = data.products.find((item) => item.id === parseInt(id));
        setProduct(product);

        const related = data.products.filter(
          (item) => item.Category === product.Category && item.id !== product.id
        );
        setRelatedProducts(related);
      } catch (error) {
        console.error("Error fetching product details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [id]);

  const handleCartToggle = async () => {
    setLoadingCartAction(true);
    try {
      if (inCart) {
        await removeFromCart(product.id);
      } else {
        await addToCart(product);
      }
    } catch (error) {
      console.error("Error updating cart:", error);
    } finally {
      setLoadingCartAction(false);
    }
  };


  return (
    <div className="w-full min-h-screen bg-gradient-to-r from-gray-800 to-gray-900 
    flex flex-col items-center justify-center py-16">
        {loading ? (
          <Loader />
        ) : (
          <div className="container mx-auto min-h-[70vh] p-6 md:p-12 bg-white shadow-lg rounded-lg 
          flex flex-col md:flex-row items-center gap-12 mb-16">
            <div className="w-full md:w-1/2">
              <img
                src={product?.Picture}
                alt={product?.Name}
                className="w-full h-80 object-contain rounded-lg shadow-md"
              />
            </div>
            <div className="flex-1 flex flex-col justify-center gap-4">
              <h1 className="sm:text-4xl text-2xl font-bold text-gray-800">{product?.Name}</h1>
              <p className="text-lg text-gray-600">{product?.Details}</p>
              <p className="text-2xl text-indigo-600 font-semibold mt-4">${product?.Price}</p>
              <h4 className="text-lg font-medium text-gray-700 mt-4">Category: {product?.Category}</h4>
              <button
                onClick={handleCartToggle}
                className={`mt-6 w-full md:w-auto ${inCart ? 'bg-red-600 hover:bg-red-700' : 'bg-indigo-600 hover:bg-indigo-700'}
                  text-white py-2 px-1 rounded-md text-lg transition-colors shadow-md flex items-center justify-center`}
                disabled={loadingCartAction}
              >
                {loadingCartAction ? (
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                  </svg>
                ) : (
                  inCart ? "Remove from Cart" : "Book a Car"
                )}
              </button>
            </div>
            </div>
        )}
      
      <RelatedProducts relatedProducts={relatedProducts} category={product?.Category} />
    </div>
  );
};

export default ProductDetails;
