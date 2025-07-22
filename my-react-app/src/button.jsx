import { useNavigate, useLocation } from 'react-router-dom';


export default function TelegramButton({ text = 'Continue', redirectTo = '/' }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleClick = () => {
    const currentSearch = location.search; // preserves ?bot=chatty or whatever
    navigate(`${redirectTo}${currentSearch}`);
  };

  return (
    <button
      onClick={handleClick}
      className="
        fixed bottom-6 left-1/2 -translate-x-1/2 z-50
        bg-[#2AABEE] bg-opacity-95 backdrop-blur-sm
        w-[90%] max-w-lg text-white text-base font-medium
        px-6 py-3 rounded-xl shadow-lg
        transition active:scale-95 font-sans
        "
    >
      {text}
    </button>
  );
}

