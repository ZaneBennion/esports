'use client';

import { Game } from '@/lib/db/schema';
import { createGame } from '@/lib/actions/games';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

// Sub-component: Column Header
function ColumnHeader({ title }: { title: string }) {
  return (
    <h2 className="text-2xl font-semibold pb-4 border-b-2 border-foreground">
      {title}
    </h2>
  )
}

// Sub-component: Create Form
function CreateForm({ onSubmit, isSubmitting }: { 
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  isSubmitting: boolean 
}) {
  return (
    <form className="flex flex-col gap-3 pb-4 border-b-2 border-foreground" onSubmit={onSubmit}>
      <input
        type="text"
        name="name"
        placeholder="Game name"
        required
        className="p-2.5 border border-foreground/20 rounded-md bg-background text-foreground text-sm"
        disabled={isSubmitting}
      />
      <label className="flex flex-col gap-1.5 text-sm text-foreground/70 cursor-pointer">
        Logo (SVG)
        <input
          type="file"
          name="logo"
          accept=".svg,image/svg+xml"
          className="text-xs cursor-pointer"
          disabled={isSubmitting}
        />
      </label>
      <button 
        type="submit" 
        className="p-2.5 px-4 border-0 rounded-md bg-foreground text-background font-semibold text-sm cursor-pointer transition-all hover:opacity-90"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Creating...' : 'Create Game'}
      </button>
    </form>
  )
}

// Sub-component: Item List
function ItemList({ games, onGameClick }: { games: Game[], onGameClick: (game: Game) => void }) {
  return (
    <div className="flex-1 overflow-y-auto flex flex-col gap-2 pr-1 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-[var(--foreground)]/5 [&::-webkit-scrollbar-track]:rounded [&::-webkit-scrollbar-thumb]:bg-[var(--foreground)]/20 [&::-webkit-scrollbar-thumb]:rounded [&::-webkit-scrollbar-thumb:hover]:bg-[var(--foreground)]/30">
      {games.length === 0 ? (
        <p className="text-center text-foreground/50 text-sm py-8 m-0">No games yet</p>
      ) : (
        games.map((game) => (
          <div
            key={game.id}
            className="flex flex-col gap-1 p-3 rounded-lg bg-[var(--foreground)]/[0.03] cursor-pointer transition-all hover:bg-[var(--foreground)]/[0.08]"
            onClick={() => onGameClick(game)}
          >
            <span className="font-semibold text-[15px]">{game.name}</span>
          </div>
        ))
      )}
    </div>
  )
}

export default function GamesColumn({ games }: { games: Game[] }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const formData = new FormData(e.currentTarget);
      await createGame(formData);
      e.currentTarget.reset();
    } catch (error) {
      console.error('Failed to create game:', error);
      alert('Failed to create game. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGameClick = (game: Game) => {
    router.push(`/admin/games/${game.id}`);
  };

  return (
    <div className="flex flex-col gap-4 bg-background rounded-xl p-6 border border-gray-200 h-[calc(100vh-200px)]">
      <ColumnHeader title="Games" />
      <CreateForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
      <ItemList games={games} onGameClick={handleGameClick} />
    </div>
  );
}

