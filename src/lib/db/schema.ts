import { or } from 'drizzle-orm'
import { pgTable, text, integer, boolean, date, timestamp, uniqueIndex, bigint, uuid, pgEnum } from 'drizzle-orm/pg-core'

// Note: user_roles table and app_role enum are managed by Supabase migration (rbac_setup.sql)
// They are included here so Drizzle doesn't try to delete them during db:push
export const appRoleEnum = pgEnum('app_role', ['user', 'admin', 'super_admin'])

export const userRoles = pgTable('user_roles', {
  id: bigint({ mode: 'number' }).primaryKey().generatedByDefaultAsIdentity(),
  userId: uuid('user_id').notNull().unique(), // references auth.users (Supabase managed)
  role: appRoleEnum('role').notNull().default('user'),
})

export const game = pgTable('game', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: text().notNull().unique(),
  slug: text().notNull().unique(),
})

export const event = pgTable('event', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: text().notNull(),
  gameId: integer('game_id').references(() => game.id).notNull(),
  slug: text().notNull(),
  startDate: date('start_date').notNull(),
  endDate: date('end_date').notNull(),
})

export const stage = pgTable('stage', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  eventId: integer('event_id').references(() => event.id).notNull(),
  name: text().notNull(),
  type: text().notNull(), // 'table' | 'bracket'
  order: integer().notNull(), // order of the stage within the event
})

export const tableMatch = pgTable('table_match', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  stageId: integer('stage_id').references(() => stage.id).notNull(),
  team: integer('team_id').references(() => org.id).notNull(),
})

export const bracketMatch = pgTable('bracket_match', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  stageId: integer('stage_id').references(() => stage.id).notNull(),
  roundNumber: integer('round_number').notNull(),
  matchInRound: integer('match_in_round').notNull(),
  parentMatch1Id: integer('parent_match_1_id').references((): any => bracketMatch.id),
  parentMatch2Id: integer('parent_match_2_id').references((): any => bracketMatch.id),
  advanceWinner1: boolean('advance_winner_1'), // true if winner advances from parentMatch1, false if loser advances
  advanceWinner2: boolean('advance_winner_2'), // true if winner advances from parentMatch2, false if loser advances
}, (table) => [
  uniqueIndex('unique_bracket_position').on(table.stageId, table.roundNumber, table.matchInRound),
])

export const match = pgTable('match', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  bracketMatchId: integer('bracket_match_id').references(() => bracketMatch.id),
  stageId: integer('stage_id').references(() => stage.id),
  teamAId: integer('team_a_id').references(() => org.id),
  teamBId: integer('team_b_id').references(() => org.id),
  teamAScore: integer('team_a_score'),
  teamBScore: integer('team_b_score'),
  result: text(), // 'team_a' | 'team_b' | 'draw' | null (null = not yet played)
  vodLink: text('vod_link'),
  matchTime: timestamp('match_time', {withTimezone: true}),
})

export const org = pgTable('org', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: text().notNull(),
  slug: text().notNull(),
  country: text().notNull(),
  region: text().notNull(),
})

export const content = pgTable('content', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  link: text().notNull(),
  name: text().notNull(),
  orgId: integer('org_id').references(() => org.id).notNull(),
})

export const player = pgTable('player', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: text().notNull(),
  slug: text().notNull(),
  orgId: integer('org_id').references(() => org.id),
})

// Type exports
export type UserRole = typeof userRoles.$inferSelect
export type Game = typeof game.$inferSelect
export type Event = typeof event.$inferSelect
export type Stage = typeof stage.$inferSelect
export type TableMatch = typeof tableMatch.$inferSelect
export type Match = typeof match.$inferSelect
export type Org = typeof org.$inferSelect
export type Player = typeof player.$inferSelect
export type Content = typeof content.$inferSelect
export type BracketMatch = typeof bracketMatch.$inferSelect