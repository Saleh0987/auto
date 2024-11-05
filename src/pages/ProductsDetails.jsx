import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Slider from 'react-slick';
import Loader from '../Ui/Loader';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { useCart } from '../context/CartContext';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const { cartItems, addToCart, removeFromCart } = useCart();
  const inCart = cartItems.some((item) => item.productId === parseInt(id));

  useEffect(() => {
    const fetchProductDetails = async () => {
      setLoading(true);
      try {
        const response = await axios.get('https://backend-end.vercel.app/products');
        const product = response.data.products.find((item) => item.id === parseInt(id));
        setProduct(product);

        const related = response.data.products.filter(
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

  const handleCartToggle = () => {
    if (inCart) {
      removeFromCart(product.id);
    } else {
      addToCart(product);
    }
  };

  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 2, slidesToScroll: 1 }
      },
      {
        breakpoint: 640,
        settings: { slidesToShow: 1, slidesToScroll: 1 }
      }
    ]
  };




  return (
    <div className="w-full min-h-screen bg-gradient-to-r from-gray-800 to-gray-900 flex flex-col items-center justify-center py-16">
      <div className="w-full max-w-6xl p-6 md:p-12 bg-white shadow-lg rounded-lg flex flex-col md:flex-row items-center gap-12 mb-16">
        {loading ? (
          <Loader />
        ) : (
          <>
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
                  className={`mt-6 w-full md:w-auto ${inCart ? ' bg-red-600 hover:bg-red-700' : ' bg-indigo-600 hover:bg-indigo-700'}
                 text-white py-3 px-6 rounded-md text-lg transition-colors shadow-md`}
              >
                {inCart ? "Remove from Cart" : "Add to Cart"}
              </button>
            </div>
          </>
        )}
      </div>
      
      {/* Related Products Slider */}
      <div className="w-full max-w-6xl px-6">
        <h2 className="text-3xl font-bold text-white mb-8">More from {product?.Category}</h2>
        <Slider {...sliderSettings}>
          {relatedProducts.map((item) => (
            <div key={item.id} className="p-4 cursor-pointer" onClick={() => navigate(`/product/${item.id}`)}>
              <div className="bg-white rounded-lg shadow-md p-4">
                <img src={item.Picture} alt={item.Name} className="w-full h-40 object-contain rounded-md mb-4" />
                <h4 className="text-lg font-semibold text-gray-800">{item.Name}</h4>
                <p className="text-indigo-600 font-bold">${item.Price}</p>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default ProductDetails;
