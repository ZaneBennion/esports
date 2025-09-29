CREATE TYPE "public"."app_permission" AS ENUM('games.create', 'games.read', 'games.update', 'games.delete', 'events.create', 'events.read', 'events.update', 'events.delete', 'brackets.create', 'brackets.read', 'brackets.update', 'brackets.delete', 'matches.create', 'matches.read', 'matches.update', 'matches.delete', 'orgs.create', 'orgs.read', 'orgs.update', 'orgs.delete', 'players.create', 'players.read', 'players.update', 'players.delete', 'users.manage', 'roles.manage');--> statement-breakpoint
CREATE TYPE "public"."app_role" AS ENUM('user', 'admin', 'super_admin');--> statement-breakpoint
CREATE TABLE "bracket" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"event_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "event" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"game_id" integer NOT NULL,
	"start_date" date NOT NULL,
	"end_date" date NOT NULL
);
--> statement-breakpoint
CREATE TABLE "game" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "match" (
	"id" serial PRIMARY KEY NOT NULL,
	"bracket_id" integer NOT NULL,
	"team_a_id" integer NOT NULL,
	"team_b_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "org" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "player" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"org_id" integer
);
--> statement-breakpoint
CREATE TABLE "role_permissions" (
	"id" serial PRIMARY KEY NOT NULL,
	"role" "app_role" NOT NULL,
	"permission" "app_permission" NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_roles" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"role" "app_role" NOT NULL
);
--> statement-breakpoint
ALTER TABLE "bracket" ADD CONSTRAINT "bracket_event_id_event_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."event"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event" ADD CONSTRAINT "event_game_id_game_id_fk" FOREIGN KEY ("game_id") REFERENCES "public"."game"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "match" ADD CONSTRAINT "match_bracket_id_bracket_id_fk" FOREIGN KEY ("bracket_id") REFERENCES "public"."bracket"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "match" ADD CONSTRAINT "match_team_a_id_org_id_fk" FOREIGN KEY ("team_a_id") REFERENCES "public"."org"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "match" ADD CONSTRAINT "match_team_b_id_org_id_fk" FOREIGN KEY ("team_b_id") REFERENCES "public"."org"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "player" ADD CONSTRAINT "player_org_id_org_id_fk" FOREIGN KEY ("org_id") REFERENCES "public"."org"("id") ON DELETE no action ON UPDATE no action;