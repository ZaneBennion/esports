'use server'

import { createAdminClient } from '../supabase/admin'

export async function uploadImage(logoFile: File, id: number, type: string) {
  if (!logoFile || logoFile.size === 0) {
    return
  }

  const supabase = createAdminClient()
  const arrayBuffer = await logoFile.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)

  const { error } = await supabase.storage
    .from('Images')
    .upload(`${type}/${id}.svg`, buffer, {
      contentType: 'image/svg+xml',
      upsert: true, // Overwrite if exists
    })

  if (error) {
    throw new Error(`Failed to upload logo: ${error.message}`)
  }
}
