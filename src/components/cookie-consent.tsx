"use client";

import { useEffect, useState } from "react";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) setVisible(true);
  }, []);

  function acceptAll() {
    localStorage.setItem("cookie-consent", "accepted");
    setVisible(false);
  }

  function manage() {
    alert("Settings panel coming soon 😉");
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 px-4">
      
      <div className="w-full max-w-2xl border-4 border-black bg-[#14a3a3] p-6 shadow-[8px_8px_0px_black]">
        
       
        <div className="mb-4 border-b-2 border-black pb-2 text-center text-lg font-bold">
          Cookie Settings
        </div>

        {/* Content */}
        <div className="space-y-4 text-sm leading-6 text-black">
          <p>
            Our website uses some cookies and records your IP address for the purposes of accessibility,
            security, and managing your access to the telecommunication network. You can disable data
            collection and cookies by changing your browser settings, but it may affect how this website functions.
            <span className="underline cursor-pointer"> Learn more</span>
          </p>

          <p>
            With your consent, we may also use cookies and your IP address to collect individual statistics
            and provide personalized offers. You can adjust or withdraw your consent anytime.
          </p>
        </div>

        
        <div className="mt-6 flex justify-center gap-4">
          <button
            onClick={acceptAll}
            className="border-2 border-black bg-yellow-300 px-5 py-2 font-bold shadow-[4px_4px_0px_black] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
          >
            Accept ALL
          </button>

          <button
            onClick={manage}
            className="border-2 border-black bg-gray-200 px-5 py-2 font-bold shadow-[4px_4px_0px_black] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
          >
            Manage Settings
          </button>
        </div>
      </div>
    </div>
  );
}