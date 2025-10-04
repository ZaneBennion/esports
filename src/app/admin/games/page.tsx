import { createGame } from "@/lib/actions/games"
import { db } from "@/lib/db"
import { game } from "@/lib/db/schema"
import styles from "./page.module.css"

export default async function Games() {
  const games = await db.select().from(game)

  return (
    <div className={styles.container}>
      <h1>Games</h1>
      
      <div className={styles.columns}>
        <div className={styles.column}>
          <h2>Create Game</h2>
          <form action={createGame} className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor="name">Game Name</label>
              <input 
                type="text" 
                id="name"
                name="name" 
                placeholder="Game name" 
                required 
                className={styles.input}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="logo">Logo (SVG)</label>
              <input 
                type="file" 
                id="logo"
                name="logo" 
                accept="image/svg+xml" 
                required 
                className={styles.input}
              />
            </div>

            <button 
              type="submit"
              className={styles.button}
            >
              Create Game
            </button>
          </form>
        </div>

        <div className={styles.column}>
          <div className={styles.gameList}>
            <h2>Existing Games</h2>
            {games.length === 0 ? (
              <p>No games yet</p>
            ) : (
              <div>
                {games.map((g) => (
                  <div key={g.id} className={styles.gameItem}>
                    <strong>{g.name}</strong>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}