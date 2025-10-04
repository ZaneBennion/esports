import { db } from "@/lib/db"
import { event, game } from "@/lib/db/schema"
import { createEvent } from "@/lib/actions/events"
import styles from "./page.module.css"

export default async function Events() {
  const events = await db.select().from(event)
  const games = await db.select().from(game)
  const gameMap = new Map(games.map(g => [g.id, g]))

  return (
    <div className={styles.container}>
      <h1>Events</h1>
      
      <div className={styles.columns}>
        <div className={styles.column}>
          <h2>Create Event</h2>
          <form action={createEvent} className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor="name">Event Name</label>
              <input 
                type="text" 
                id="name"
                name="name" 
                placeholder="Event name" 
                required 
                className={styles.input}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="gameId">Game</label>
              <select 
                id="gameId"
                name="gameId" 
                required
                className={styles.select}
              >
                <option value="">Select a game</option>
                {games.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="startDate">Start Date</label>
              <input 
                type="date" 
                id="startDate"
                name="startDate" 
                required 
                className={styles.input}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="endDate">End Date</label>
              <input 
                type="date" 
                id="endDate"
                name="endDate" 
                required 
                className={styles.input}
              />
            </div>

            <button 
              type="submit"
              className={styles.button}
            >
              Create Event
            </button>
          </form>
        </div>

        <div className={styles.column}>
          <div className={styles.eventList}>
            <h2>Existing Events</h2>
            {events.length === 0 ? (
              <p>No events yet</p>
            ) : (
              <div>
                {events.map((e) => (
                  <div key={e.id} className={styles.eventItem}>
                    <strong>{e.name}</strong>
                    <div>Game: {gameMap.get(e.gameId)?.name}</div>
                    <div>{e.startDate} to {e.endDate}</div>
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