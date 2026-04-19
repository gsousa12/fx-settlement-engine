export const IdempotencyKeysStatusEnum = {
  PROCESSING: "processing",
  COMPLETED: "completed",
  FAILED: "failed",
} as const;

export type IdempotencyKeysStatusType =
  (typeof IdempotencyKeysStatusEnum)[keyof typeof IdempotencyKeysStatusEnum];

export const IDEMPOTENCY_KEYS_STATUS_VALUES = ["processing", "completed", "failed"] as const;
