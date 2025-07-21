import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Greeting() {
  const navigate = useNavigate();
  const location = useLocation();

  const [bot, setBot] = useState('');
  const [gift, setGift] = useState('');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const botParam = params.get('bot');
    const giftParam = params.get('gift');

    setBot(botParam);
    setGift(giftParam);
    setReady(true); // indicates params have been checked
  }, [location.search]);

  const handleClick = () => {
    if (bot && gift) {
      navigate(`/final${location.search}`);
    } else {
      window.location.href = "https://getgems.io/";
    }
  };

  if (!ready) {
    return <div className="text-white text-center mt-10">Загрузка...</div>;
  }

  return (
    <div className="h-screen font-sans flex flex-col items-center justify-center text-center p-4 bg-gray-800 text-white">
      <h1 className="text-3xl font-bold mb-6">Добро пожаловать в {bot || 'наш магазин'}</h1>
      <h3 className="text-gray-400 mb-8">
        Здесь начинается мир продажи и обмена подарками
      </h3>
      <button
        onClick={handleClick}
        className="bg-blue-600 px-6 py-3 rounded-lg text-white hover:bg-blue-700 transition"
      >
        Продолжить
      </button>
    </div>
  );
}

