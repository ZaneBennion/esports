ALTER TABLE "role_permissions" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "role_permissions" CASCADE;--> statement-breakpoint
ALTER TABLE "user_roles" ALTER COLUMN "role" SET DEFAULT 'user';--> statement-breakpoint
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_user_id_unique" UNIQUE("user_id");--> statement-breakpoint
DROP TYPE "public"."app_permission";