import React from 'react';
import { RiFlashlightFill, RiTempColdLine, RiDashboard3Line } from 'react-icons/ri';
import useAuth from '../custom-hooks/useAuth';
import HeroImg from '../assets/img/home.png';
import { Link } from 'react-router-dom';

const Home = () => {
  const { currentUser } = useAuth();

  return (
    <section className="relative flex items-center justify-center min-h-screen bg-gradient-to-r from-gray-800 to-gray-900 text-white overflow-hidden" id="home">
      <div className="grid max-w-4xl mx-auto gap-6 p-6">
        <div className="text-center">
          <h1 className="text-3xl sm:text-5xl font-bold mb-2">Choose The Best Car</h1>
          <h2 className="sm:text-3xl text-2xl mb-2">Porsche Mission E</h2>
          <h3 className="flex items-center justify-center text-lg text-gray-300">
            <RiFlashlightFill className="mr-2" /> Electric car
          </h3>
        </div>
        <img src={HeroImg} alt="Porsche Mission E" className="w-full max-w-md mx-auto" />
        <div className="grid grid-cols-3 gap-4">
          <div className="flex flex-col items-center">
            <RiTempColdLine className="text-2xl mb-2" />
            <h2 className="text-3xl mb-2">24°</h2>
            <h3 className="text-sm text-gray-400">TEMPERATURE</h3>
          </div>
          <div className="flex flex-col items-center">
            <RiDashboard3Line className="text-2xl mb-2" />
            <h2 className="text-3xl mb-2">873</h2>
            <h3 className="text-sm text-gray-400">MILEAGE</h3>
          </div>
          <div className="flex flex-col items-center">
            <RiFlashlightFill className="text-2xl mb-2" />
            <h2 className="text-3xl mb-2">94%</h2>
            <h3 className="text-sm text-gray-400">BATTERY</h3>
          </div>
        </div>
          <Link className="home--button mt-4">START</Link>
      </div>
    </section>
  );
};

export default Home;