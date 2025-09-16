## Supabase setup

Add these environment variables to your `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
# Optional (server-only, do not expose publicly)
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### Clients

- Browser client: `lib/supabase/client.ts` exposes `getSupabaseBrowserClient()`.
- Server client: `lib/supabase/server.ts` exposes `getSupabaseServerClient()`.

### Minimal usage examples

Client Component:

```tsx
"use client";
import { useEffect, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

export function ProfileEmail() {
  const [email, setEmail] = useState<string | null>(null);
  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    supabase.auth.getUser().then(({ data }) => setEmail(data.user?.email ?? null));
  }, []);
  return <div>{email ?? "Signed out"}</div>;
}
```

Server Component / Route Handler:

```tsx
import { getSupabaseServerClient } from "@/lib/supabase/server";

export default async function Page() {
  const supabase = getSupabaseServerClient();
  const { data } = await supabase.from("teams").select("id,name").limit(5);
  return <pre>{JSON.stringify(data, null, 2)}</pre>;
}
```

Notes:
- The server client uses Next.js `cookies()` to persist auth across requests.
- Ensure the `NEXT_PUBLIC_*` env vars are set in all environments (local, CI, prod).