CREATE TYPE "public"."checkout_status" AS ENUM('pending', 'completed', 'expired', 'canceled');--> statement-breakpoint
CREATE TYPE "public"."order_status" AS ENUM('pending', 'paid', 'failed', 'refunded');--> statement-breakpoint
CREATE TYPE "public"."order_type" AS ENUM('onetime', 'recurring');--> statement-breakpoint
CREATE TABLE "checkout_sessions" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"product_id" text NOT NULL,
	"product_name" text NOT NULL,
	"request_id" text,
	"checkout_url" text,
	"success_url" text,
	"status" "checkout_status" DEFAULT 'pending',
	"units" integer DEFAULT 1,
	"amount" integer NOT NULL,
	"currency" varchar(3) DEFAULT 'USD',
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "orders" (
	"id" text PRIMARY KEY NOT NULL,
	"checkout_session_id" text,
	"user_id" text NOT NULL,
	"customer_id" text,
	"product_id" text NOT NULL,
	"product_name" text NOT NULL,
	"order_id" text,
	"subscription_id" text,
	"status" "order_status" DEFAULT 'pending',
	"type" "order_type" NOT NULL,
	"amount" integer NOT NULL,
	"currency" varchar(3) DEFAULT 'USD',
	"signature" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_checkout_session_id_checkout_sessions_id_fk" FOREIGN KEY ("checkout_session_id") REFERENCES "public"."checkout_sessions"("id") ON DELETE no action ON UPDATE no action;