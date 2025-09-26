import { pgTable, serial, text, integer, boolean } from 'drizzle-orm/pg-core'

export const game = pgTable('game', {
  id: serial().primaryKey(),
  name: text().notNull(),
})

export const event = pgTable('event', {
  id: serial().primaryKey(),
  name: text().notNull(),
  gameId: integer('game_id').references(() => game.id).notNull(),
})

export const bracket = pgTable('bracket', {
  id: serial().primaryKey(),
  name: text().notNull(),
  eventId: integer('event_id').references(() => event.id).notNull(),
})

export const match = pgTable('match', {
  id: serial().primaryKey(),
  bracketId: integer('bracket_id').references(() => bracket.id).notNull(),
  teamAId: integer('team_a_id').references(() => org.id).notNull(),
  teamBId: integer('team_b_id').references(() => org.id).notNull(),
})

export const org = pgTable('org', {
  id: serial().primaryKey(),
  name: text().notNull(),
})

export const player = pgTable('player', {
  id: serial().primaryKey(),
  name: text().notNull(),
  orgId: integer('org_id').references(() => org.id),
})

export const user = pgTable('user', {
  id: serial().primaryKey(),
  name: text().notNull(),
  email: text().notNull(),
  password: text().notNull(),
  isAdmin: boolean('is_admin').notNull().default(false),
})