import { createOrg } from "@/lib/actions/orgs"
import { db } from "@/lib/db"
import { org } from "@/lib/db/schema"

export default async function Orgs() {
  const orgs = await db.select().from(org)
  return <div>
    {orgs.map((org) => (
      <div key={org.id}>
        {org.name}
      </div>
    ))}

    <form action={createOrg}>
      <input type="text" name="name" placeholder="Org name" required />
      <input type="file" name="logo" accept="image/svg+xml" required />
      <input type="text" name="country" placeholder="Country" required />
      <select name="region" required>
        <option value="">Select region</option>
        <option value="amer">AMER</option>
        <option value="pac">PAC</option>
        <option value="emea">EMEA</option>
        <option value="cn">CN</option>
      </select>
      <button type="submit">Create Org</button>
    </form>
  </div>
}