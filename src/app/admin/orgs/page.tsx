import { createOrg } from "@/lib/actions/orgs"
import { db } from "@/lib/db"
import { org } from "@/lib/db/schema"
import styles from "./page.module.css"

export default async function Orgs() {
  const orgs = await db.select().from(org)

  return (
    <div className={styles.container}>
      <h1>Organizations</h1>
      
      <div className={styles.columns}>
        <div className={styles.column}>
          <h2>Create Organization</h2>
          <form action={createOrg} className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor="name">Organization Name</label>
              <input 
                type="text" 
                id="name"
                name="name" 
                placeholder="Org name" 
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

            <div className={styles.formGroup}>
              <label htmlFor="country">Country</label>
              <input 
                type="text" 
                id="country"
                name="country" 
                placeholder="Country" 
                required 
                className={styles.input}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="region">Region</label>
              <select 
                id="region"
                name="region" 
                required
                className={styles.select}
              >
                <option value="">Select region</option>
                <option value="amer">AMER</option>
                <option value="pac">PAC</option>
                <option value="emea">EMEA</option>
                <option value="cn">CN</option>
              </select>
            </div>

            <button 
              type="submit"
              className={styles.button}
            >
              Create Organization
            </button>
          </form>
        </div>

        <div className={styles.column}>
          <div className={styles.orgList}>
            <h2>Existing Organizations</h2>
            {orgs.length === 0 ? (
              <p>No organizations yet</p>
            ) : (
              <div>
                {orgs.map((o) => (
                  <div key={o.id} className={styles.orgItem}>
                    <strong>{o.name}</strong>
                    <div>Country: {o.country}</div>
                    <div>Region: {o.region}</div>
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