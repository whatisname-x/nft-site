import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Greeting() {
  const navigate = useNavigate();
  const location = useLocation();

  const [bot, setBot] = useState('');
  const [shouldShowPage, setShouldShowPage] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const botParam = urlParams.get('bot');
    const giftParam = urlParams.get('gift');

    if (!botParam || !giftParam) {
      window.location.href = "https://getgems.io/";
    } else {
      setBot(botParam);
      setShouldShowPage(true);
    }
  }, [location.search]);

  const handleContinue = () => {
    navigate(`/final${location.search}`);
  };

  if (!shouldShowPage) {
    return <div className="text-white text-center mt-10">Перенаправление...</div>;
  }

  return (
    <div className="h-screen font-sans flex flex-col items-center justify-center text-center p-4 bg-gray-800 text-white">
      <h1 className="text-3xl font-bold mb-6">Добро пожаловать в {bot}</h1>
      <h3 className="text-gray-400 mb-8">Здесь начинается мир продажи и обмена подарками</h3>
      <button
        onClick={handleContinue}
        className="bg-blue-600 px-6 py-3 rounded-lg text-white hover:bg-blue-700 transition"
      >
        Продолжить
      </button>
    </div>
  );
}

