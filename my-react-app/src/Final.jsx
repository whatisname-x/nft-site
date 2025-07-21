import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

const NFTCard = () => {
  const [previewContent, setPreviewContent] = useState(null);
  const [fields, setFields] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Extract collectible ID from gift URL (for SVG text only)
  const params = new URLSearchParams(location.search);
  const giftUrl = params.get("gift");
  const botUsername = params.get("bot");

  let collectibleId = "";
  if (giftUrl) {
    const match = giftUrl.match(/EternalRose-(\d+)/);
    if (match) collectibleId = match[1];
  }

  function removeTextFromSvgAndInsertCustom(svgString) {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(svgString, "image/svg+xml");

      // Remove all <text> elements
      const textElements = doc.getElementsByTagName("text");
      for (let i = textElements.length - 1; i >= 0; i--) {
        const el = textElements[i];
        el.parentNode?.removeChild(el);
      }

      // Create new "Eternal Rose" text
      const eternalText = doc.createElementNS("http://www.w3.org/2000/svg", "text");
      eternalText.setAttribute("x", "210");
      eternalText.setAttribute("y", "235"); // mt-5 effect
      eternalText.setAttribute("font-size", "23");
      eternalText.setAttribute("font-weight", "500");
      eternalText.setAttribute("text-anchor", "middle");
      eternalText.setAttribute("dominant-baseline", "middle");
      eternalText.setAttribute("fill", "#fff");
      eternalText.textContent = "Eternal Rose";

      // Create a <g> group for collectible text + background
      const collectibleGroup = doc.createElementNS("http://www.w3.org/2000/svg", "g");
      collectibleGroup.setAttribute("transform", "translate(210, 260)"); // Position group

      // Create background rect behind collectible text
      const rect = doc.createElementNS("http://www.w3.org/2000/svg", "rect");
      rect.setAttribute("x", "-80"); // shift left to cover text width approx
      rect.setAttribute("y", "-22"); // shift up to center vertically approx
      rect.setAttribute("width", "160"); // width to cover text width
      rect.setAttribute("height", "28"); // height to cover text height
      rect.setAttribute("fill", "rgba(96, 85, 99, 0.2")// Tailwind gray-600 hex color
      rect.setAttribute("rx", "16"); // rounded corners
      rect.setAttribute("ry", "16");

      // Create collectible text itself
      const collectibleText = doc.createElementNS("http://www.w3.org/2000/svg", "text");
      collectibleText.setAttribute("x", "0");
      collectibleText.setAttribute("y", "-7");
      collectibleText.setAttribute("font-size", "16");
      collectibleText.setAttribute("font-weight", "400");
      collectibleText.setAttribute("text-anchor", "middle");
      collectibleText.setAttribute("dominant-baseline", "middle");
      collectibleText.setAttribute("fill", "#fff");
      eternalText.setAttribute("y", "220");

      // Collectible text stays as is
      collectibleGroup.setAttribute("transform", "translate(210, 260)");
      collectibleText.textContent = `Collectible #${collectibleId}`;

      // Append rect and text into the group
      collectibleGroup.appendChild(rect);
      collectibleGroup.appendChild(collectibleText);

      // Append everything to svg root <g> or <svg>
      const svgRoot = doc.querySelector("svg > g") || doc.querySelector("svg");
      svgRoot.appendChild(eternalText);
      svgRoot.appendChild(collectibleGroup);

      return new XMLSerializer().serializeToString(doc);
    } catch (e) {
      console.error("SVG parsing failed:", e);
      return svgString;
    }
  }

  // Cache fetched data to avoid repeated fetches
  const [cache, setCache] = useState({});

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

        // Parse all fields except Owner
        const attrs = { Model: "Model", Backdrop: "Backdrop", Symbol: "Symbol"};
        const cells = [...doc.querySelectorAll("td, th")];
        const out = [];

        for (let eng in attrs) {
          const cell = cells.find((c) => c.textContent.trim().startsWith(eng));
          let valRaw = cell?.nextElementSibling?.innerHTML.trim() || "—";

          valRaw = valRaw.replace(/&nbsp;/g, " ");
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
          setLoading(true)
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
  const handleTelegramShare = () => {
    if (!giftUrl) return;

    // Compose Telegram share URL
    const tgUrl = `tg://msg_url?text=Check out this gift!&url=${encodeURIComponent(giftUrl)}`;

    // Directly assign window.location.href (not opening a new tab)
    window.location.href = tgUrl;
  };

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
    <div className="min-h-screen font-sans bg-gray-900 flex justify-center items-center p-4 font-sans text-white">
      <div className="bg-gray-800 w-full rounded-2xl shadow-lg text-center relative pb-5 overflow-hidden">
        <div className="mb-2 flex flex-col items-center">
          {loading && !error && (
            <>
              <div className="relative w-full aspect-[3/2] bg-gray-700 rounded-lg overflow-hidden mb-4 animate-pulse">
                <div className="absolute inset-0 bg-gray-600" />
              </div>

              <div className="flex gap-4 justify-center flex-wrap mb-6">
                {[...Array(2)].map((_, i) => (
                  <div
                    key={i}
                    className="h-[48px] min-w-[120px] rounded-xl bg-gray-700 animate-pulse"
                  ></div>
                ))}
              </div>

              <div className="rounded-xl pl-3 pr-3 pb-2 text-left animate-pulse">
                <table className="w-full table-fixed border-collapse">
                  <tbody>
                    {[...Array(3)].map((_, i) => (
                      <tr
                        key={i}
                        className="border border-gray-300 border-opacity-20"
                      >
                        <td className="bg-[#292F3B] px-4 py-3 min-w-[100px]">
                          <div className="h-4 w-24 bg-gray-600 rounded"></div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="h-4 w-40 bg-gray-600 rounded"></div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-6 w-[55%] bg-gray-700 h-12 rounded-3xl mx-auto animate-pulse"></div>
            </>
          )}
          {error && <div className="text-red-500 text-lg font-semibold">{error}</div>}
          {!loading && !error && previewContent && (
            <>
              <div className="relative w-full aspect-[3/2] bg-gray-700 rounded-lg overflow-hidden mb-4">
                <div
                  className="absolute inset-0 [&>svg]:w-full [&>svg]:h-full [&>svg]:block [&>svg]:m-0 [&>svg]:p-0"
                  dangerouslySetInnerHTML={{ __html: removeTextFromSvgAndInsertCustom(previewContent.bgDiv) }}
                />
                {previewContent.tgsUrl && (
                  <div className="absolute top-1/4 left-1/2 w-36 h-36 -translate-x-1/2 -translate-y-1/4 text-lg flex justify-center items-center overflow-hidden">
                    <tgs-player
                      src={previewContent.tgsUrl}
                      autoplay
                      loop
                      className="rounded-lg mb-10 object-contain"
                    />
                  </div>
                )}
              </div>
            </>
          )}
        </div>
        {!loading && !error && (
          <div className="flex gap-4 justify-center flex-wrap mb-6">
            <a
              href={giftUrl || "#"}
              target="_blank"
              rel="noreferrer"
              className="bg-gray-700 hover:bg-gray-600 transition px-5 py-3 rounded-xl font-semibold min-w-[120px]"
            >
              In Telegram
            </a>
            <a
              href={giftUrl ? `https://t.me/share/url?text=Check out this gift!&url=${giftUrl}` : "#"}
              target="_blank"
              rel="noreferrer"
              className="bg-gray-700 hover:bg-gray-600 transition px-5 py-3 rounded-xl font-semibold min-w-[120px]"
            >
              Share
            </a>
          </div>
        )}


        {!loading && !error && (
          <div className=" rounded-xl pl-3 pr-3 pb-2 text-left ">
            <table className="w-full table-fixed border-collapse">
              <tbody>
                {fields.map(({ label, value }) => (
                  <tr
                    key={label}
                    className="border border-gray-300 border-opacity-20"
                  >
                    <td className="bg-[#292F3B] text-gray-300 font-semibold px-4 py-2 min-w-[100px] border-r border-white border-opacity-20 select-text">
                      {label}
                    </td>
                    <td className="text-blue-400 break-words px-4 py-2 border-white border-opacity-20 border-l select-text">
                      {value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>


        )}
        {!loading && !error && (
          <button
            onClick={() => navigate("/intro" + location.search)}
            className="mt-6 w-[55%] bg-blue-500 transition rounded-3xl py-3 font-bold text-white"
          >
            Get a Gift
          </button>
        )}
      </div>
    </div>
  );
};

export default NFTCard;

