import { db } from "@/lib/db"
import { event, game } from "@/lib/db/schema"
import { createEvent } from "@/lib/actions/events"

export default async function Events() {
  const events = await db.select().from(event)
  const games = await db.select().from(game)

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Events</h1>
      
      <form action={createEvent} style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '1rem',
        maxWidth: '500px',
        marginTop: '2rem'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label htmlFor="name">Event Name</label>
          <input 
            type="text" 
            id="name"
            name="name" 
            placeholder="Event name" 
            required 
            style={{ padding: '0.5rem', fontSize: '1rem' }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label htmlFor="gameId">Game</label>
          <select 
            id="gameId"
            name="gameId" 
            required
            style={{ padding: '0.5rem', fontSize: '1rem' }}
          >
            <option value="">Select a game</option>
            {games.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </select>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label htmlFor="startDate">Start Date</label>
          <input 
            type="date" 
            id="startDate"
            name="startDate" 
            required 
            style={{ padding: '0.5rem', fontSize: '1rem' }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label htmlFor="endDate">End Date</label>
          <input 
            type="date" 
            id="endDate"
            name="endDate" 
            required 
            style={{ padding: '0.5rem', fontSize: '1rem' }}
          />
        </div>

        <button 
          type="submit"
          style={{ 
            padding: '0.75rem', 
            fontSize: '1rem',
            backgroundColor: '#0070f3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginTop: '0.5rem'
          }}
        >
          Create Event
        </button>
      </form>

      <div style={{ marginTop: '3rem' }}>
        <h2>Existing Events</h2>
        {events.length === 0 ? (
          <p>No events yet</p>
        ) : (
          <ul>
            {events.map((e) => (
              <li key={e.id}>
                {e.name} - {e.startDate} to {e.endDate}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}