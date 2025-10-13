'use client'

import { useState } from 'react'
import { updateEvent } from '@/lib/actions/events'
import { Event } from '@/lib/db/schema'

interface EventEditorProps {
  event: Event
}

export default function EventEditor({ event }: EventEditorProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true)
    try {
      await updateEvent(event.id, formData)
      setIsEditing(false)
    } catch (error) {
      console.error('Failed to update event:', error)
      alert('Failed to update event')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isEditing) {
    return (
      <div>
        <form action={handleSubmit}>
          <div>
            <div>
              <label htmlFor="name">
                Event Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                defaultValue={event.name}
                required
              />
            </div>
            
            <div>
              <label htmlFor="startDate">
                Start Date
              </label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                defaultValue={event.startDate}
                required
              />
            </div>
            
            <div>
              <label htmlFor="endDate">
                End Date
              </label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                defaultValue={event.endDate}
                required
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Saving...' : 'Save'}
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                disabled={isSubmitting}
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      </div>
    )
  }

  return (
    <div>
      <div>
        <h1>{event.name}</h1>
        <div>
          <span>{event.startDate}</span>
          <span> to </span>
          <span>{event.endDate}</span>
        </div>
      </div>
      
      <button
        onClick={() => setIsEditing(true)}
      >
        Edit
      </button>
    </div>
  )
}
