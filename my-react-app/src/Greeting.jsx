import { useNavigate } from 'react-router-dom'
import { useLocation } from 'react-router-dom';
import TelegramButton from './button';


export default function Greeting() {
  const navigate = useNavigate()
  const location = useLocation();

  const searchParams = location.search;
  const urlParams = new URLSearchParams(window.location.search)
  const bot = urlParams.get('bot') 


  return (
    <div className="h-screen flex flex-col items-center justify-center text-center p-4 bg-gray-800 text-white">
      <h1 className="text-3xl font-bold mb-6">Добро пожаловать в {bot}</h1>
      <TelegramButton text="Продолжить" redirectTo="/final" />
    </div>
  )
}
