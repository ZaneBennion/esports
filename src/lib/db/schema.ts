import { pgTable, serial, text, integer, boolean, date, uuid, pgEnum } from 'drizzle-orm/pg-core'

// RBAC
export const appRoleEnum = pgEnum('app_role', ['user', 'admin', 'super_admin'])

export const userRoles = pgTable('user_roles', {
  id: serial().primaryKey(),
  userId: uuid('user_id').notNull().unique(),
  role: appRoleEnum('role').notNull().default('user'),
})

export const game = pgTable('game', {
  id: serial().primaryKey(),
  name: text().notNull(),
  slug: text().notNull(),
})

export const event = pgTable('event', {
  id: serial().primaryKey(),
  name: text().notNull(),
  gameId: integer('game_id').references(() => game.id).notNull(),
  startDate: date('start_date').notNull(),
  endDate: date('end_date').notNull(),
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
  slug: text().notNull(),
})

export const player = pgTable('player', {
  id: serial().primaryKey(),
  name: text().notNull(),
  orgId: integer('org_id').references(() => org.id),
})

// Type exports
export type UserRole = typeof userRoles.$inferSelect
export type Game = typeof game.$inferSelect
export type Event = typeof event.$inferSelect
export type Bracket = typeof bracket.$inferSelect
export type Match = typeof match.$inferSelect
export type Org = typeof org.$inferSelect
export type Player = typeof player.$inferSelect