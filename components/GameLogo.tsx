"use client";

import Image from "next/image";

export default function GameLogo({ game }: { game: string }) {
  const logoPath = `/images/logos/${game}.svg`;
  
  return (
    <div className="game-logo-container">
      <Image
        src={logoPath}
        alt={game}
        width={32}
        height={32}
        className="game-logo"
        onError={(e) => {
          // Hide the image and show text fallback
          e.currentTarget.style.display = 'none';
          const parent = e.currentTarget.parentElement;
          if (parent) {
            parent.innerHTML = game;
          }
        }}
      />
    </div>
  );
}
