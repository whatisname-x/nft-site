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
        fixed bottom-4 left-1/2 -translate-x-1/2 z-50
        bg-[#2AABEE] w-[90%] text-white text-base font-medium
        px-6 py-3 rounded-xl shadow-md
        transition active:scale-95
      "
    >
      {text}
    </button>
  );
}

