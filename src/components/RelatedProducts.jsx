import React from 'react';
import { useNavigate } from 'react-router-dom';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const RelatedProducts = ({ relatedProducts, category }) => {
  const navigate = useNavigate();

  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 1000,
    slidesToShow: 3,
    slidesToScroll: 2,
    autoplay: true,
    autoplaySpeed: 1500,
    arrows: false,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2, slidesToScroll: 1 } },
      { breakpoint: 640, settings: { slidesToShow: 1, slidesToScroll: 1 } }
    ]
  };

  return (
    <div className="container mx-auto">
      <h2 className="text-3xl text-center font-bold text-white mb-8">
        More from {category}
      </h2>
      <Slider {...sliderSettings}>
        {relatedProducts.map((item) => (
          <div key={item.id} className="p-4 cursor-pointer" onClick={() => navigate(`/product/${item.id}`)}>
            <div className="bg-white rounded-lg shadow-md p-4">
              <img src={item.Picture} alt={item.Name} className="w-full h-40 object-contain rounded-md mb-4" />
              <h4 className="text-sm font-semibold text-gray-800">{item.Name}</h4>
              <p className="text-indigo-600 font-bold my-2">${item.Price}</p>
              <h3 className="text-lg font-medium ">{item?.Category}</h3>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default RelatedProducts;
