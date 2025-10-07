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

export const bracket = pgTable('bracket', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  eventId: integer('event_id').references(() => event.id).notNull(),
  name: text().notNull(),
})

export const bracketMatch = pgTable('bracket_match', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  bracketId: integer('bracket_id').references(() => bracket.id).notNull(),
  roundNumber: integer('round_number').notNull(),
  matchInRound: integer('match_in_round').notNull(),
  parentMatch1Id: integer('parent_match_1_id').references((): any => bracketMatch.id),
  parentMatch2Id: integer('parent_match_2_id').references((): any => bracketMatch.id),
  advanceWinner1: boolean('advance_winner_1'), // true if winner advances from parentMatch1, false if loser advances
  advanceWinner2: boolean('advance_winner_2'), // true if winner advances from parentMatch2, false if loser advances
  matchTime: timestamp('match_time', {withTimezone: true}),
}, (table) => [
  uniqueIndex('unique_bracket_position').on(table.bracketId, table.roundNumber, table.matchInRound),
])

export const match = pgTable('match', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  bracketMatchId: integer('bracket_match_id').references(() => bracketMatch.id),
  teamAId: integer('team_a_id').references(() => org.id).notNull(),
  teamBId: integer('team_b_id').references(() => org.id).notNull(),
  teamAScore: integer('team_a_score'),
  teamBScore: integer('team_b_score'),
  result: text(), // 'team_a' | 'team_b' | 'draw' | null (null = not yet played)
  vodLink: text('vod_link'),
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
export type Bracket = typeof bracket.$inferSelect
export type Match = typeof match.$inferSelect
export type Org = typeof org.$inferSelect
export type Player = typeof player.$inferSelect
export type Content = typeof content.$inferSelect
export type BracketMatch = typeof bracketMatch.$inferSelect