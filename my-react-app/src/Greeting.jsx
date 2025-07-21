import { useNavigate } from 'react-router-dom'
import { useLocation } from 'react-router-dom';
import TelegramButton from './button';
import { useEffect, useState } from 'react';


export default function Greeting() {
  const navigate = useNavigate()
  const location = useLocation();
  const [redirect, setRedirectTo] = useState("");

  const searchParams = location.search;
  const urlParams = new URLSearchParams(window.location.search)
  const bot = urlParams.get('bot') 
  const url = urlParams.get('gift')
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const bot = urlParams.get('bot');
    const url = urlParams.get('gift');

    if (!url || !bot) {
      setRedirectTo("https://getgems.io/");
    } else {
      setRedirectTo("/final");
    }
  }, [location.search]);

  return (
    <div className="h-screen font-sans flex flex-col items-center justify-center text-center p-4 bg-gray-800 text-white">
      <h1 className="text-3xl font-bold mb-6">Добро пожаловать в {bot}</h1>
      <h3 className="text-gray-400">Здесь начинаеться мир продажи и обмена подарками</h3>
      <TelegramButton text="Продолжить" redirectTo="/final" />
    </div>
  )
}
