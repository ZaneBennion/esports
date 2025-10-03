import { db } from "@/lib/db"
import { content, org } from "@/lib/db/schema"
import { createContent } from "@/lib/actions/content"

export default async function Content() {
  const contents = await db.select().from(content)
  const orgs = await db.select().from(org)

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Content</h1>
      
      <form action={createContent} style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '1rem',
        maxWidth: '500px',
        marginTop: '2rem'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label htmlFor="link">Content Link</label>
          <input 
            type="text" 
            id="link"
            name="link" 
            placeholder="https://..." 
            required 
            style={{ padding: '0.5rem', fontSize: '1rem' }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label htmlFor="orgId">Organization</label>
          <select 
            id="orgId"
            name="orgId" 
            required
            style={{ padding: '0.5rem', fontSize: '1rem' }}
          >
            <option value="">Select an organization</option>
            {orgs.map((o) => (
              <option key={o.id} value={o.id}>
                {o.name}
              </option>
            ))}
          </select>
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
          Add Content
        </button>
      </form>

      <div style={{ marginTop: '3rem' }}>
        <h2>Existing Content</h2>
        {contents.length === 0 ? (
          <p>No content yet</p>
        ) : (
          <ul>
            {contents.map((c) => (
              <li key={c.id}>
                {c.link} (Org ID: {c.orgId})
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}