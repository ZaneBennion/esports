'use client';

import styles from './Column.module.css';

export default function PlayersColumn() {
  return (
    <div className={styles.column}>
      <h2 className={styles.columnTitle}>Players</h2>
      <p className={styles.emptyText}>Coming soon...</p>
    </div>
  );
}

