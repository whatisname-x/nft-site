import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from 'react-router-dom'
import { useLocation } from 'react-router-dom';

const NFTCard = () => {
  const [previewContent, setPreviewContent] = useState(null);
  const [fields, setFields] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate()
  const location = useLocation();



  // Cache data to avoid re-fetch on re-render if URL params unchanged
  const [cache, setCache] = useState({});
  const searchParams = location.search;

  const params = new URLSearchParams(window.location.search);
  const giftUrl = params.get("gift");
  const botUsername = params.get("bot");

  const telegramHref = giftUrl || "#";
  const shareHref = giftUrl
    ? `tg://msg_url?text=Check out this gift!&url=${giftUrl}`
    : "#";

  const loadNFT = useCallback(
    async (retryCount = 0, maxRetries = 3) => {
      if (!giftUrl || !botUsername) {
        window.location.href = "https://getgems.io/";
        return;
      }

      if (!giftUrl.startsWith("https://t.me/")) {
        setError("Некорректная ссылка.");
        setPreviewContent(null);
        setFields([]);
        setLoading(false);
        return;
      }

      // Return cached if we already got data for this URL
      if (cache[giftUrl]) {
        setPreviewContent(cache[giftUrl].previewContent);
        setFields(cache[giftUrl].fields);
        setError(null);
        setLoading(false);
        return;
      }

      const proxy = "https://api.allorigins.win/raw?url=";

      try {
        setLoading(true);
        setError(null);

        const res = await fetch(proxy + giftUrl);
        if (!res.ok) throw new Error("Network error");

        const html = await res.text();
        const doc = new DOMParser().parseFromString(html, "text/html");

        const gift = doc.querySelector(".tgme_gift_preview");
        const svg = gift?.querySelector("svg");

        const bgDiv = svg ? svg.outerHTML : null;

        const source = doc.querySelector('source[type="application/x-tgsticker"]');
        const tgsUrl = source?.srcset?.split(",")[0]?.trim() || null;

        const previewContentNew = { bgDiv, tgsUrl };

        const attrs = { Model: "Model", Backdrop: "Backdrop", Symbol: "Symbol" };
        const cells = [...doc.querySelectorAll("td, th")];
        const out = [];

        for (let eng in attrs) {
          const cell = cells.find((c) => c.textContent.trim().startsWith(eng));
          const valRaw = cell?.nextElementSibling?.innerHTML.trim() || "—";
          const val = valRaw.replace(/<mark[^>]*>|<\/mark>/gi, "");
          out.push({ label: attrs[eng], value: val });
        }

        setPreviewContent(previewContentNew);
        setFields(out);
        setCache((prev) => ({ ...prev, [giftUrl]: { previewContent: previewContentNew, fields: out } }));
        setLoading(false);
      } catch (e) {
        console.error(`Error loading NFT (attempt ${retryCount + 1}):`, e);
        if (retryCount < maxRetries) {
          setError("Loading...");
          setTimeout(() => loadNFT(retryCount + 1, maxRetries), 3000);
        } else {
          setError("Ошибка загрузки обновите страницу!");
          setFields([]);
          setLoading(false);
        }
      }
    },
    [botUsername, giftUrl, cache]
  );

  useEffect(() => {
    loadNFT();
  }, [loadNFT]);

  const openBot = (e) => {
    e.preventDefault();
    if (!botUsername) return;

    const url = `https://t.me/${botUsername}?start=connect`;
    window.open(url, "_blank");

    if (
      window.Telegram &&
      window.Telegram.WebApp &&
      typeof window.Telegram.WebApp.close === "function"
    ) {
      window.Telegram.WebApp.close();
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex justify-center items-center p-4 font-sans text-white">
      <div className="bg-gray-800 max-w-lg w-full rounded-2xl p-8 shadow-lg text-center relative overflow-hidden">
        <div className="mb-6 flex flex-col items-center">
          {loading && !error && (
            <div className="text-red-400 text-lg font-semibold">Loading...</div>
          )}
          {error && <div className="text-red-500 text-lg font-semibold">{error}</div>}
          {!loading && !error && previewContent && (
            <>
              <div className="relative flex flex-col w-full max-w-md h-52 rounded-lg overflow-hidden bg-gray-700 mx-auto mb-4 flex justify-center items-center">
                <div
                  className="w-min-full h-min-full"
                  dangerouslySetInnerHTML={{ __html: previewContent.bgDiv }}
                />
                {previewContent.tgsUrl && (
                  <div className="absolute top-1/2 left-1/2 w-32 h-32 rounded-lg z-10 pointer-events-none -translate-x-1/2 -translate-y-1/2 flex justify-center items-center overflow-hidden">
                    <tgs-player
                      src={previewContent.tgsUrl}
                      autoplay
                      loop
                      className="w-full h-full rounded-lg object-contain"
                    />
                  </div>
                )}
                <p className="text-5xl"></p>
              </div>
            </>
          )}
        </div>

        <div className="flex gap-4 justify-center flex-wrap mb-6">
          <a
            href={telegramHref}
            target="_blank"
            rel="noreferrer"
            className="bg-gray-700 hover:bg-gray-600 transition px-5 py-3 rounded-xl font-semibold min-w-[120px]"
          >
            In Telegram
          </a>
          <a
            href={shareHref}
            target="_blank"
            rel="noreferrer"
            className="bg-gray-700 hover:bg-gray-600 transition px-5 py-3 rounded-xl font-semibold min-w-[120px]"
          >
            Share
          </a>
        </div>

        {!loading && !error && (
          <div className="bg-gray-900 rounded-xl p-5 text-left">
            {fields.map(({ label, value }) => (
              <div key={label} className="flex flex-col justify-between mb-4 text-base">
                <div className="text-gray-400 min-w-[80px]">{label}</div>
                <p className="text-blue-600">{value}</p>
              </div>
            ))}
          </div>
        )}

        <button
          onClick={() => navigate('/intro' + searchParams)}
          className="mt-6 w-full bg-red-600 hover:bg-red-500 transition rounded-xl py-3 font-bold text-white"
        >
          Get a Gift
        </button>

              
      </div>
    </div>
  );
};

export default NFTCard;

