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
        bg-[#2da7e0]
        w-[88%] h-14
        rounded-xl
        text-white text-[17px] font-medium
        hover:bg-[#199ad9]
        transition
        flex items-center justify-center
        "
    >
      {text}
    </button>
  );
}

