import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Loader from '../Ui/Loader';
import { useCart } from '../context/CartContext';

const Services = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const { addToCart, removeFromCart, cartItems } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await axios.get('https://backend-end.vercel.app/products');
        setProducts(response.data.products);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold text-white text-center mb-8">Our Services</h1>
      {loading ? <Loader /> : 
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => {
          const inCart = cartItems.some((item) => item.productId === product.id);

          return (
            <div key={product.id} className="bg-white rounded-lg shadow-md flex flex-col items-center justify-between p-4 hover:shadow-xl min-h-[300px] transition-shadow duration-300">
              <Link to={`/product/${product.id}`} className="w-full">
                <img src={product.Picture} alt={product.Name}
                  loading="lazy"
                  className="w-full h-48 object-contain rounded-t-md" />
                <div className="mt-4">
                  <h2 className="text-lg font-semibold text-gray-800">{product.Name}</h2>
                  <p className="text-gray-600 mt-2">{product.Details}</p>
                  <p className="text-indigo-600 font-bold mt-4">${product.Price}</p>
                  <h4 className="text-lg font-semibold text-gray-800">{product.Category}</h4>
                </div>
              </Link>
              <button
                onClick={inCart ? () => removeFromCart(product.id) : () => addToCart(product)}
                className={`mt-4 w-full ${inCart ? 'bg-gray-400' : 'bg-indigo-600 hover:bg-indigo-700'}
                  text-white py-2 rounded-md transition-colors duration-300`}
              >
                {inCart ? "Remove from Cart" : "Add to Cart"}
              </button>
            </div>
          );
        })}
      </div>}
    </div>
  );
}

export default Services;
