import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from 'react-router-dom'
import { useLocation } from 'react-router-dom';

export default  fucntion NFTCard()  {
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
  <div className="min-h-screen bg-black flex justify-center items-center p-4 font-sans text-white">
    <div className="bg-[#1e1e1e] max-w-md w-full rounded-3xl overflow-hidden shadow-xl text-center relative">
      {/* Top gradient image (parsed SVG) */}
      <div className="bg-gradient-to-br from-[#9166f2] to-[#a670e7] p-6">
        <div className="flex justify-center items-center">
          <div
            className="w-[140px] h-[140px]"
            dangerouslySetInnerHTML={{ __html: previewContent?.bgDiv || "" }}
          />
        </div>
        <h2 className="mt-4 text-white text-xl font-bold">Bonded Ring</h2>
        <p className="text-purple-200 text-sm">Collectible #{/* you can extract number here */}</p>
      </div>

      {/* Info fields */}
      <div className="bg-[#111111] px-6 py-6 text-left">
        {!loading && !error && (
          <>
            {/* Owner */}
            <div className="mb-4">
              <p className="text-gray-400 text-sm">Owner</p>
              <p className="text-white break-all text-sm font-mono">
                {fields.find(f => f.label === "Owner")?.value || "—"}
              </p>
            </div>

            {/* Render other fields */}
            {fields.map(({ label, value }) =>
              label !== "Owner" ? (
                <div key={label} className="mb-4">
                  <p className="text-gray-400 text-sm">{label}</p>
                  <p className="text-blue-400 text-sm">{value}</p>
                </div>
              ) : null
            )}
          </>
        )}

        {/* Error / Loading state */}
        {loading && <div className="text-red-400 font-semibold text-center">Loading...</div>}
        {error && <div className="text-red-500 font-semibold text-center">{error}</div>}
      </div>

      {/* Action button */}
      <div className="bg-[#1e1e1e] px-6 pb-6">
        <a
          href={telegramHref}
          target="_blank"
          rel="noreferrer"
          className="block w-full text-center bg-[#3390ec] hover:bg-[#2f7fd0] transition py-3 rounded-xl font-semibold"
        >
          View in Telegram
        </a>
      </div>
    </div>
  </div>
);



