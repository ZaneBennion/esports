'use client';

import { Game } from '@/lib/db/schema';
import { createGame } from '@/lib/actions/games';
import { useState } from 'react';
import styles from './Column.module.css';

export default function GamesColumn({ games }: { games: Game[] }) {
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    // Placeholder functionality - will be implemented later
    console.log('Game clicked:', game);
  };

  return (
    <div className={styles.column}>
      <h2 className={styles.columnTitle}>Games</h2>
      
      <form className={styles.form} onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Game name"
          required
          className={styles.input}
          disabled={isSubmitting}
        />
        <label className={styles.fileLabel}>
          Logo (SVG)
          <input
            type="file"
            name="logo"
            accept=".svg,image/svg+xml"
            className={styles.fileInput}
            disabled={isSubmitting}
          />
        </label>
        <button type="submit" className={styles.button} disabled={isSubmitting}>
          {isSubmitting ? 'Creating...' : 'Create Game'}
        </button>
      </form>

      <div className={styles.list}>
        {games.length === 0 ? (
          <p className={styles.emptyText}>No games yet</p>
        ) : (
          games.map((game) => (
            <div
              key={game.id}
              className={styles.listItem}
              onClick={() => handleGameClick(game)}
            >
              <span className={styles.itemName}>{game.name}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

