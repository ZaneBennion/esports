'use server'

import { db } from '@/lib/db'
import { content } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { createAdminClient } from '../supabase/admin'
import { revalidatePath } from 'next/cache'

export async function createContent(formData: FormData) {
  const link = formData.get('link') as string
  const orgId = parseInt(formData.get('orgId') as string)

  await db.insert(content).values({
    link,
    orgId,
  })

  revalidatePath('/admin/content')
}