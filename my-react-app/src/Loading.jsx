import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Loading() {
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState(false);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const bot_id = searchParams.get('bot_id');
    const user_id = window.Telegram?.WebApp?.initDataUnsafe?.user?.id;

    const checkConnection = async () => {
      try {
        const res = await fetch('https://tralalelotralala.digital:8001/check_connection', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_id, bot_id }),
        });
        alert("HEY")

        if (!res.ok) throw new Error('Network response was not ok');

        const data = await res.json();
        console.log('[✅] API Response:', data);
        alert(data)

        navigate('/final' + location.search);
      } catch (err) {
        console.error('[❌] API call failed:', err);
        setError(true);

        // Wait 5 seconds then redirect to /intro with same search params
        setTimeout(() => {
          navigate('/intro' + location.search);
        }, 5000);
      }
    };

    checkConnection();
  }, []);

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-800 text-red-500 flex-col px-4 text-center">
        <b className="text-2xl mb-4">Переверьте подключение до бота</b>
        <p className="text-sm text-gray-300">Сейчас перекинем назад...</p>
      </div>
    );
  }

  return (
    <div className="h-screen flex items-center justify-center bg-gray-800 text-white flex-col">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
      <b className="mt-10">Проверяем подключение...</b>
    </div>
  );
}

