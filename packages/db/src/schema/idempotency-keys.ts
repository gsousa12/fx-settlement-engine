import {
  pgTable,
  uuid,
  text,
  jsonb,
  integer,
  timestamp,
  uniqueIndex,
  index,
  check,
  pgEnum,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { IDEMPOTENCY_KEYS_STATUS_VALUES, IdempotencyKeysStatusEnum } from "@fx-settlement-engine/enums";

export const idempotencyKeysStatusEnum = pgEnum(
  "idempotency_keys_status",
  IDEMPOTENCY_KEYS_STATUS_VALUES,
);

export const idempotencyKeys = pgTable(
  "idempotency_keys",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    // Escopo por tenant — keys de tenants diferentes não colidem
    tenantId: uuid("tenant_id").notNull(),

    // A chave enviada pelo cliente no header Idempotency-Key
    key: text("key").notNull(),

    status: idempotencyKeysStatusEnum("status").notNull().default(IdempotencyKeysStatusEnum.PROCESSING),

    // Resposta serializada — retornada diretamente em replays
    responseBody: jsonb("response_body"),
    responseStatus: integer("response_status"),

    // Expiração: keys completadas são limpas por um job periódico
    // Keys 'processing' não expiram — evita liberar um lock ativo
    expiresAt: timestamp("expires_at", { withTimezone: true })
      .notNull()
      .default(sql`NOW() + INTERVAL '24 hours'`),

    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => ({
    // Unicidade por (tenant, key) — permite o ON CONFLICT DO UPDATE
    tenantKeyUnique: uniqueIndex("idempotency_keys_tenant_key_idx").on(
      t.tenantId,
      t.key,
    ),

    // Índice para o job de limpeza de keys expiradas
    expiresAtIdx: index("idempotency_keys_expires_at_idx").on(t.expiresAt),

    // Constraint de status — falha ruidosa se vier valor inválido
    statusCheck: check(
      "idempotency_keys_status_check",
      sql`status IN ('processing', 'completed', 'failed')`,
    ),
  }),
);
