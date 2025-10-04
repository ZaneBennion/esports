import { db } from "@/lib/db"
import { content, org } from "@/lib/db/schema"
import { createContent } from "@/lib/actions/content"
import styles from "./page.module.css"
import { getOrgById } from "@/lib/actions/orgs"

export default async function Content() {
  const contents = await db.select().from(content)
  const orgs = await db.select().from(org)
  const orgMap = new Map(orgs.map(o => [o.id, o]))

  return (
    <div className={styles.container}>
      <h1>Content</h1>
      
      <div className={styles.columns}>
        <div className={styles.column}>
          <h2>Create Content</h2>
          <form action={createContent} className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor="link">Content Link</label>
              <input 
                type="text" 
                id="link"
                name="link" 
                placeholder="https://..." 
                required 
                className={styles.input}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="orgId">Organization</label>
              <select 
                id="orgId"
                name="orgId" 
                required
                className={styles.select}
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
              className={styles.button}
            >
              Add Content
            </button>
          </form>
        </div>

        <div className={styles.column}>
          <div className={styles.contentList}>
            <h2>Existing Content</h2>
            {contents.length === 0 ? (
              <p>No content yet</p>
            ) : (
              <ul>
                {contents.map((c) => (
                  <li key={c.id}>
                    {c.link} (Org: {orgMap.get(c.orgId)?.name})
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}