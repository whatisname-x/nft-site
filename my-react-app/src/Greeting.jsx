import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Greeting() {
  const navigate = useNavigate();
  const location = useLocation();

  const params = new URLSearchParams(location.search);
  const bot = params.get('bot');
  const gift = params.get('gift');
  const urlParams = new URLSearchParams(window.location.search);


  const handleClick = () => {
    if (bot && gift) {
      navigate("/final" + location.search);
    } else {
      navigate("/intro" + location.search)
    }
  };


  return (
    <div className="h-screen relative font-sans flex flex-col items-center justify-center text-center p-4 bg-gray-800 text-white">
      <h1 className="text-3xl font-bold mb-6">Добро пожаловать в {bot || 'наш маркет'}</h1>
      <h3 className="text-gray-400 mb-8">
        Здесь начинается мир продажи и обмена подарками
      </h3>
      <button
        onClick={handleClick}
        className="bg-[#2da7e0] w-[88%] absolute bottom-6 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-lg text-white text-sm font-medium hover:bg-[#199ad9] transition"
      >
        Продолжить
      </button>
    </div>
  );
}

