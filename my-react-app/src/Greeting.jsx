import { useNavigate } from 'react-router-dom'
import { useLocation } from 'react-router-dom';

export default function Greeting() {
  const navigate = useNavigate()
  const location = useLocation();

  const searchParams = location.search;
  const urlParams = new URLSearchParams(window.location.search)
  const bot = urlParams.get('bot') 


  return (
    <div className="h-screen flex flex-col items-center justify-center text-center p-4 bg-gray-800 text-white">
      <h1 className="text-3xl font-bold mb-6">Добро пожаловать в {bot}</h1>
      <button
        onClick={() => navigate('/final' + searchParams)}
        className="bg-blue-500 text-white px-6 py-2 rounded-xl hover:bg-blue-600"
      >
        Продолжить
      </button>
    </div>
  )
}
