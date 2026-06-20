import React from "react";

// Types
export interface LogoAsset {
  svg: string;
  bgColor: string;
  borderColor: string;
}

// Brand SVG Mappings (Diet Coke theme compatible, high fidelity, flat/gradient vectors)
export const LOGO_MAPPINGS: Record<string, LogoAsset> = {
  netflix: {
    bgColor: "bg-black",
    borderColor: "border-red-600/30",
    svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full p-1.5">
      <path d="M4 2v20h4.256V11.895L15.744 22H20V2h-4.256v10.105L8.256 2H4z" fill="#E50914"/>
    </svg>`
  },
  spotify: {
    bgColor: "bg-[#0c0c0c]",
    borderColor: "border-green-500/20",
    svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full p-1">
      <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.586 14.424c-.18.295-.565.387-.86.207-2.377-1.454-5.37-1.783-8.894-.98-.336.075-.668-.135-.744-.47-.077-.337.135-.668.47-.745 3.856-.88 7.15-.506 9.82.13.296.18.388.563.208.858zm1.224-2.723c-.226.367-.707.487-1.074.26-2.72-1.672-6.87-2.157-10.077-1.182-.41.124-.842-.107-.967-.518-.125-.41.107-.842.518-.967 3.67-1.114 8.24-.567 11.34 1.34.367.227.487.708.26 1.075zm.106-2.833C14.384 8.797 8.544 8.6 5.16 9.626c-.54.164-1.107-.146-1.27-.687-.164-.54.146-1.107.687-1.27 3.885-1.18 10.339-.96 14.41 1.46.486.288.643.91.354 1.396-.288.487-.91.644-1.396.355z" fill="#1DB954"/>
    </svg>`
  },
  primevideo: {
    bgColor: "bg-[#0F172A]",
    borderColor: "border-sky-500/20",
    svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full p-1">
      <path d="M12.5 13.5c-2.485 0-4.5 1.567-4.5 3.5s2.015 3.5 4.5 3.5 4.5-1.567 4.5-3.5-2.015-3.5-4.5-3.5z" fill="#00A8E1" fill-opacity="0.1"/>
      <path d="M1 18.5s4-3.5 11-3.5 11 3.5 11 3.5c-3-1.5-7-2.5-11-2.5s-8 1-11 2.5z" stroke="#00A8E1" stroke-width="2" stroke-linecap="round"/>
      <path d="M19 18.5l3.5.5-1.5-3.5-2 3z" fill="#FF9900"/>
    </svg>`
  },
  "disney+hotstar": {
    bgColor: "bg-[#030B1E]",
    borderColor: "border-sky-400/20",
    svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full p-1.5">
      <path d="M12 2a10 10 0 00-6.88 17.24 1.5 1.5 0 011.02-2.54c1.86-.34 4.88-.7 7.86-.7 3.5 0 5.76.5 6.64.9a1.5 1.5 0 01.88 1.4A10 10 0 0012 2z" fill="#0063E5"/>
      <path d="M12 8.5l1.1 2.3 2.5.3-1.8 1.8.4 2.5-2.2-1.2-2.2 1.2.4-2.5-1.8-1.8 2.5-.3L12 8.5z" fill="#FFC928"/>
    </svg>`
  },
  "chatgptplus": {
    bgColor: "bg-[#0F172A]",
    borderColor: "border-emerald-500/20",
    svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full p-1.5">
      <path d="M21.5 10.5c.3-1.2-.4-2.5-1.7-2.8l-1.3-.3.5-1.3c.4-1.2-.2-2.5-1.5-2.9-1.2-.4-2.5.2-2.9 1.5l-.3 1.3-1.3-.5c-1.2-.4-2.5.2-2.9 1.5-.4 1.2.2 2.5 1.5 2.9l1.3.3-.5 1.3c-.4 1.2.2 2.5 1.5 2.9h.4l1.3-.5 1.3.5h.4c1.2.4 2.5-.2 2.9-1.5l.3-1.3 1.3.5c.5.2.9.2 1.3 0zm-8.8-4.5c.6-.2 1.2.1 1.4.7l.6 1.8-.7 1.8-.7.3-1.8-.6c-.6-.2-.9-.8-.7-1.4.2-.6.8-.9 1.4-.7l.5.4zm3.9 6.2l-1.8.6-.6-.7.6-1.8 1.8-.6c.6-.2 1.2.1 1.4.7.2.6-.1 1.2-.7 1.4l-.7.4z" fill="#10A37F"/>
      <circle cx="12" cy="12" r="10" stroke="#10A37F" stroke-width="1.5"/>
    </svg>`
  },
  openai: {
    bgColor: "bg-[#0F172A]",
    borderColor: "border-emerald-500/20",
    svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full p-1.5">
      <path d="M21.5 10.5c.3-1.2-.4-2.5-1.7-2.8l-1.3-.3.5-1.3c.4-1.2-.2-2.5-1.5-2.9-1.2-.4-2.5.2-2.9 1.5l-.3 1.3-1.3-.5c-1.2-.4-2.5.2-2.9 1.5-.4 1.2.2 2.5 1.5 2.9l1.3.3-.5 1.3c-.4 1.2.2 2.5 1.5 2.9h.4l1.3-.5 1.3.5h.4c1.2.4 2.5-.2 2.9-1.5l.3-1.3 1.3.5c.5.2.9.2 1.3 0zm-8.8-4.5c.6-.2 1.2.1 1.4.7l.6 1.8-.7 1.8-.7.3-1.8-.6c-.6-.2-.9-.8-.7-1.4.2-.6.8-.9 1.4-.7l.5.4zm3.9 6.2l-1.8.6-.6-.7.6-1.8 1.8-.6c.6-.2 1.2.1 1.4.7.2.6-.1 1.2-.7 1.4l-.7.4z" fill="#10A37F"/>
      <circle cx="12" cy="12" r="10" stroke="#10A37F" stroke-width="1.5"/>
    </svg>`
  },
  canva: {
    bgColor: "bg-[#0C0F1A]",
    borderColor: "border-purple-500/20",
    svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full p-1.5">
      <circle cx="12" cy="12" r="10" fill="url(#canvaGrad)"/>
      <path d="M8 12c1.5-1.5 3-2.5 4.5-2s2 1.5 3.5.5M8 14.5c2-1 4.5-1.5 6-1" stroke="#FFFFFF" stroke-width="1.5" stroke-linecap="round"/>
      <defs>
        <linearGradient id="canvaGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#00C4CC"/>
          <stop offset="50%" stopColor="#7D2AE8"/>
          <stop offset="100%" stopColor="#FF70A6"/>
        </linearGradient>
      </defs>
    </svg>`
  },
  canvapro: {
    bgColor: "bg-[#0C0F1A]",
    borderColor: "border-purple-500/20",
    svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full p-1.5">
      <circle cx="12" cy="12" r="10" fill="url(#canvaGrad2)"/>
      <path d="M8 12c1.5-1.5 3-2.5 4.5-2s2 1.5 3.5.5M8 14.5c2-1 4.5-1.5 6-1" stroke="#FFFFFF" stroke-width="1.5" stroke-linecap="round"/>
      <defs>
        <linearGradient id="canvaGrad2" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#00C4CC"/>
          <stop offset="50%" stopColor="#7D2AE8"/>
          <stop offset="100%" stopColor="#FF70A6"/>
        </linearGradient>
      </defs>
    </svg>`
  },
  adobe: {
    bgColor: "bg-black",
    borderColor: "border-red-500/20",
    svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full p-1.5">
      <path d="M14.5 3H22v18H14.5L22 7.5V21h-2.5L14.5 11 9.5 21H7V3h7.5L9.5 13.5 14.5 3z" fill="#FF0000"/>
    </svg>`
  },
  adobecreativecloud: {
    bgColor: "bg-black",
    borderColor: "border-red-500/20",
    svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full p-1.5">
      <path d="M14.5 3H22v18H14.5L22 7.5V21h-2.5L14.5 11 9.5 21H7V3h7.5L9.5 13.5 14.5 3z" fill="#FF0000"/>
    </svg>`
  },
  youtubepremium: {
    bgColor: "bg-[#0c0c0c]",
    borderColor: "border-red-600/20",
    svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full p-1.5">
      <rect x="2" y="5" width="20" height="14" rx="4" fill="#FF0000"/>
      <path d="M10 9l6 3-6 3V9z" fill="#FFFFFF"/>
    </svg>`
  },
  youtube: {
    bgColor: "bg-[#0c0c0c]",
    borderColor: "border-red-600/20",
    svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full p-1.5">
      <rect x="2" y="5" width="20" height="14" rx="4" fill="#FF0000"/>
      <path d="M10 9l6 3-6 3V9z" fill="#FFFFFF"/>
    </svg>`
  },
  googleone: {
    bgColor: "bg-[#0c0c0c]",
    borderColor: "border-white/5",
    svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full p-1.5">
      <path d="M12 2A10 10 0 002 12a10 10 0 0010 10 10 10 0 0010-10H12V2z" fill="#4285F4"/>
      <path d="M12 2c2.5 0 4.8 1 6.5 2.5l-2.5 2.5C14.8 6.3 13.5 6 12 6V2z" fill="#EA4335"/>
      <path d="M18.5 4.5A9.9 9.9 0 0122 12h-4c0-1.5-.3-2.8-1-3.8l2.5-3.7z" fill="#FBBC05"/>
      <path d="M12 18c-3.3 0-6-2.7-6-6h-4c0 5.5 4.5 10 10 10v-4z" fill="#34A853"/>
    </svg>`
  },
  google: {
    bgColor: "bg-[#0c0c0c]",
    borderColor: "border-white/5",
    svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full p-1.5">
      <path d="M12 2A10 10 0 002 12a10 10 0 0010 10 10 10 0 0010-10H12V2z" fill="#4285F4"/>
      <path d="M12 2c2.5 0 4.8 1 6.5 2.5l-2.5 2.5C14.8 6.3 13.5 6 12 6V2z" fill="#EA4335"/>
      <path d="M18.5 4.5A9.9 9.9 0 0122 12h-4c0-1.5-.3-2.8-1-3.8l2.5-3.7z" fill="#FBBC05"/>
      <path d="M12 18c-3.3 0-6-2.7-6-6h-4c0 5.5 4.5 10 10 10v-4z" fill="#34A853"/>
    </svg>`
  },
  microsoft365: {
    bgColor: "bg-[#0c0c0c]",
    borderColor: "border-orange-500/20",
    svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full p-1.5">
      <path d="M2 2h9v9H2V2z" fill="#F25022"/>
      <path d="M13 2h9v9h-9V2z" fill="#7FBA00"/>
      <path d="M2 13h9v9H2v-9z" fill="#00A1F1"/>
      <path d="M13 13h9v9h-9v-9z" fill="#FFB900"/>
    </svg>`
  },
  microsoft: {
    bgColor: "bg-[#0c0c0c]",
    borderColor: "border-orange-500/20",
    svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full p-1.5">
      <path d="M2 2h9v9H2V2z" fill="#F25022"/>
      <path d="M13 2h9v9h-9V2z" fill="#7FBA00"/>
      <path d="M2 13h9v9H2v-9z" fill="#00A1F1"/>
      <path d="M13 13h9v9h-9v-9z" fill="#FFB900"/>
    </svg>`
  },
  applemusic: {
    bgColor: "bg-black",
    borderColor: "border-pink-500/20",
    svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full p-1">
      <circle cx="12" cy="12" r="10" fill="url(#musicGrad)"/>
      <path d="M9 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zm0 0V8.5l8-1.5V14.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zm0-5l8-1.5" stroke="#FFFFFF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      <defs>
        <linearGradient id="musicGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FD2472"/>
          <stop offset="100%" stopColor="#FE3A50"/>
        </linearGradient>
      </defs>
    </svg>`
  },
  apple: {
    bgColor: "bg-black",
    borderColor: "border-pink-500/20",
    svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full p-1">
      <circle cx="12" cy="12" r="10" fill="url(#musicGrad)"/>
      <path d="M9 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zm0 0V8.5l8-1.5V14.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zm0-5l8-1.5" stroke="#FFFFFF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      <defs>
        <linearGradient id="musicGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FD2472"/>
          <stop offset="100%" stopColor="#FE3A50"/>
        </linearGradient>
      </defs>
    </svg>`
  }
};

// Returns a logo representation (Never emojis)
export function getSubscriptionLogo(name: string): LogoAsset {
  const normalized = name.toLowerCase().replace(/[^a-z0-9]/g, "");
  
  // Direct match
  if (LOGO_MAPPINGS[normalized]) {
    return LOGO_MAPPINGS[normalized];
  }
  
  // Partial matches
  for (const key of Object.keys(LOGO_MAPPINGS)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return LOGO_MAPPINGS[key];
    }
  }

  // Fallback: Elegant branded metallic letter card
  const firstLetter = name.charAt(0).toUpperCase();
  const hexColors = [
    { bg: "bg-[#111111]", border: "border-neutral-700/30", text: "#FFFFFF" },
    { bg: "bg-[#150505]", border: "border-red-900/30", text: "#EF233C" },
    { bg: "bg-[#0A1A10]", border: "border-green-900/30", text: "#1DB954" }
  ];
  // Simple hash to consistently select color based on name
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const color = hexColors[Math.abs(hash) % hexColors.length];

  const svg = `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full p-2">
    <rect width="24" height="24" rx="6" fill="#0A0A0A" stroke="rgba(255,255,255,0.06)" stroke-width="1.2"/>
    <text x="50%" y="62%" dominant-baseline="middle" text-anchor="middle" font-family="'Outfit', sans-serif" font-weight="900" font-size="12" fill="${color.text}">${firstLetter}</text>
  </svg>`;

  return {
    bgColor: color.bg,
    borderColor: color.border,
    svg
  };
}
