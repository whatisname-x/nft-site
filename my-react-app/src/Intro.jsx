import { useNavigate } from 'react-router-dom'
import { useLocation } from 'react-router-dom';


export default function Intro() {
  const navigate = useNavigate()
  const location = useLocation();
  const urlParams = new URLSearchParams(window.location.search);
  
    const copyToClipboard = async (text) => {
      try {
        await navigator.clipboard.writeText(text);
      } catch (err) {
        alert("Failed to copy!");
      }
    };
  // get current search params string, like "?bot=chatty"
  const searchParams = location.search;
  const bot = urlParams.get('bot') 


  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-gray-800 text-white">
      <h2 className="text-2xl font-semibold mb-4">Вижу вы у нас впервые...</h2>
      <div className="grid grid-cols-1 gap-4 mb-6">
        <div className="border border-slate-700 bg-slate-700 rounded-xl p-4">
          <b>Шаг 1: Откройте настройки для бизнеса</b>
          <p>Зайдите в Настройки -> Telegram для бизнеса</p>
          <img alt='guide' src="images/photo1.jpg" className="w-64 h-128 object-cover mx-auto" />
        </div>
        <div className="border border-slate-700 bg-slate-700 rounded-xl p-4">
          <b>Шаг2: Найдите раздел чат-ботов</b>
          <p>В меню бизнес-функий выберите Чат-боты</p>
           <img alt='guide' src="images/photo2.jpg" className="w-64 h-128 object-cover mx-auto" />
        </div>
        <div className="border border-slate-700 bg-slate-700 rounded-xl p-4">
          <b>Шаг3: Подключите нашего бота</b>
          <p>В поле имени бота введите (нажмите, чтобы скопировать)</p>
          <div onClick={copyToClipboard} className="cursor-pointer select-all text-blue-800">
            {bot}
          </div>
          <img alt='guide' src="images/photo3.jpg" className="w-64 h-128 object-cover mx-auto" />
        </div>
        <div className="border border-slate-700 bg-slate-700 rounded-xl p-4">
          <b>Шаг4: Предоставьте разрешения</b>
          <p>установите галочу управлять подарками <br/> и звездами, чтобы мы могли обрабатывать ваши обмены</p>
        </div>
      </div>
      <button
        onClick={() => navigate('/loading' + searchParams)}
        className="bg-blue-500 text-white px-6 py-2 rounded-xl hover:bg-blue-600"
      >
        Продолжить
      </button>
    </div>
  )
}
