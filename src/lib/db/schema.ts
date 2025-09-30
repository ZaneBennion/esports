import { pgTable, text, integer, boolean, date, uuid } from 'drizzle-orm/pg-core'

// Note: user_roles table and app_role enum are managed by Supabase migration (rbac_setup.sql)
// They are not included in this schema to avoid conflicts

export const game = pgTable('game', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: text().notNull(),
  slug: text().notNull(),
})

export const event = pgTable('event', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: text().notNull(),
  gameId: integer('game_id').references(() => game.id).notNull(),
  slug: text().notNull(),
  startDate: date('start_date').notNull(),
  endDate: date('end_date').notNull(),
})

export const bracket = pgTable('bracket', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: text().notNull(),
  eventId: integer('event_id').references(() => event.id).notNull(),
})

export const match = pgTable('match', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  bracketId: integer('bracket_id').references(() => bracket.id).notNull(),
  teamAId: integer('team_a_id').references(() => org.id).notNull(),
  teamBId: integer('team_b_id').references(() => org.id).notNull(),
})

export const org = pgTable('org', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: text().notNull(),
  slug: text().notNull(),
})

export const player = pgTable('player', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: text().notNull(),
  orgId: integer('org_id').references(() => org.id),
})

// Type exports
export type Game = typeof game.$inferSelect
export type Event = typeof event.$inferSelect
export type Bracket = typeof bracket.$inferSelect
export type Match = typeof match.$inferSelect
export type Org = typeof org.$inferSelect
export type Player = typeof player.$inferSelect