CREATE TYPE "public"."idempotency_keys_status" AS ENUM('processing', 'completed', 'failed');--> statement-breakpoint
CREATE TABLE "idempotency_keys" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"key" text NOT NULL,
	"status" "idempotency_keys_status" DEFAULT 'processing' NOT NULL,
	"response_body" jsonb,
	"response_status" integer,
	"expires_at" timestamp with time zone DEFAULT NOW() + INTERVAL '24 hours' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "idempotency_keys_status_check" CHECK (status IN ('processing', 'completed', 'failed'))
);
--> statement-breakpoint
CREATE UNIQUE INDEX "idempotency_keys_tenant_key_idx" ON "idempotency_keys" USING btree ("tenant_id","key");--> statement-breakpoint
CREATE INDEX "idempotency_keys_expires_at_idx" ON "idempotency_keys" USING btree ("expires_at");