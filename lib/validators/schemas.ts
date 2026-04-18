import { z } from "zod";

export const monitorStateEnum = z.enum(["healthy", "degraded", "down"]);
export const monitorTypeEnum = z.enum(["http", "tcp", "ping"]);
export const userTypeEnum = z.enum(["admin", "operator", "viewer", "ghost"]);
export const issueCodeEnum = z.enum(["400", "401", "402", "403", "404", "405", "406", "407", "408", "409", "500", "428"]);

export const userOutSchema = z.object({
  mobile: z.string().nullable().optional(),
  profile_picture: z.string().nullable().optional(),
  uuid: z.string().uuid().optional(),
  first_name: z.string().max(150).nullable().optional(),
  last_name: z.string().max(150).nullable().optional(),
  alias: z.string().max(100).nullable().optional(),
  use_alias: z.boolean().default(false).optional(),
  email: z.string().max(254),
  type: userTypeEnum.default("ghost").optional(),
  date_created: z.string().datetime(),
  email_verified: z.boolean().default(false).optional(),
  has_completed_sign_up: z.boolean().default(false).optional()
});

export const loginOutSchema = z.object({
  token: z.string(),
  profile: userOutSchema
});

export const errorResponseSchema = z.object({
  message: z.string().nullable().optional(),
  success: z.boolean().default(false).optional(),
  code: issueCodeEnum
});

export const responseSchema = z.object({
  message: z.string().nullable().optional(),
  success: z.boolean().default(true).optional(),
  data: z.unknown().optional()
});

export const registerUserInSchema = z.object({
  first_name: z.string().min(1),
  last_name: z.string().min(1),
  email: z.string().email(),
  password: z.string(),
  mobile: z.string(),
  alias: z.string().nullable().optional(),
  use_alias: z.boolean().nullable().optional()
});

export const verifyEmailOTPInSchema = z.object({
  email: z.string().email(),
  otp: z.string()
});

export const emailInSchema = z.object({ email: z.string().email() });
export const loginInSchema = z.object({ email: z.string().email(), password: z.string() });
export const passwordResetValidateInSchema = z.object({ token: z.string(), uid: z.string() });
export const passwordResetConfirmInSchema = passwordResetValidateInSchema.extend({ new_password: z.string() });
export const changePasswordInSchema = z.object({ new_password: z.string(), old_password: z.string() });

export const monitorOutSchema = z.object({
  uuid: z.string().uuid().optional(),
  name: z.string().max(255),
  type: monitorTypeEnum,
  target: z.string().max(512),
  is_active: z.boolean().default(true).optional(),
  current_state: monitorStateEnum.default("healthy").optional(),
  last_downtime_at: z.string().datetime().nullable().optional(),
  last_alert_state: z.string().max(20).nullable().optional(),
  consecutive_healthy: z.number().int().default(0).optional(),
  date_created: z.string().datetime()
});

export const monitorInSchema = z.object({
  name: z.string(),
  type: monitorTypeEnum,
  target: z.string(),
  is_active: z.boolean(),
  current_state: monitorStateEnum
});

export const monitorUpdateSchema = z.object({
  name: z.string().nullable().optional(),
  target: z.string().nullable().optional(),
  type: monitorTypeEnum.nullable().optional(),
  is_active: z.boolean().nullable().optional()
});

export const monitorFilterSchema = z.object({
  current_state: monitorStateEnum.nullable().optional(),
  target: z.string().nullable().optional(),
  type: monitorTypeEnum.nullable().optional(),
  is_active: z.boolean().nullable().optional(),
  page_index: z.number().int().min(1).default(1).optional(),
  page_size: z.number().int().min(1).max(100).default(10).optional(),
  ordering: z.string().nullable().optional()
});

export const monitorStateHistoryFilterSchema = z.object({
  uuid: z.string().uuid().nullable().optional(),
  monitor_id: z.string().uuid().nullable().optional(),
  previous_state: monitorStateEnum.nullable().optional(),
  new_state: monitorStateEnum.nullable().optional(),
  page_index: z.number().int().min(1).default(1).optional(),
  page_size: z.number().int().min(1).max(100).default(10).optional(),
  ordering: z.string().nullable().optional()
});

export const monitorStateHistoryOutSchema = z.object({
  monitor: monitorOutSchema,
  uuid: z.string().uuid().optional(),
  previous_state: z.string().max(20),
  new_state: z.string().max(20),
  latency_ms: z.number().nullable().optional(),
  jitter_ms: z.number().nullable().optional(),
  packet_loss: z.number().nullable().optional(),
  success: z.boolean().default(true).optional(),
  error_message: z.string().nullable().optional(),
  date_created: z.string().datetime()
});

export const pagedSchema = <T extends z.ZodTypeAny>(item: T) =>
  z.object({
    message: z.string().nullable().optional(),
    success: z.boolean().default(true).optional(),
    total: z.number().int(),
    page_size: z.number().int(),
    page_index: z.number().int(),
    nb_pages: z.number().int(),
    previous: z.string().nullable(),
    next: z.string().nullable(),
    data: z.array(item)
  });

export const pagedMonitorOutSchema = pagedSchema(monitorOutSchema);
export const pagedMonitorStateHistoryOutSchema = pagedSchema(monitorStateHistoryOutSchema);
export const pagedUserOutSchema = pagedSchema(userOutSchema);

export const telegramLinkOutSchema = z.object({ link: z.string() });
export const telegramWebhookResponseSchema = z.object({ ok: z.boolean().default(true).optional() });

export const systemSettingsOutSchema = z.object({
  uuid: z.string().uuid().optional(),
  alert_emails: z.record(z.unknown()).nullable().optional(),
  telegram_chat_ids: z.record(z.unknown()).nullable().optional(),
  combine_alerts: z.boolean().default(true).optional(),
  combine_window_seconds: z.number().int().default(60).optional(),
  date_created: z.string().datetime()
});

export const systemSettingsInSchema = z.object({
  alert_emails: z.array(z.unknown()).nullable().optional(),
  telegram_chat_ids: z.array(z.unknown()).nullable().optional(),
  combine_alerts: z.boolean().nullable().optional(),
  combine_window_seconds: z.number().int().nullable().optional()
});

export const systemSettingsUpdateSchema = systemSettingsInSchema;
export const adminUserFilterSchema = z.object({
  type: userTypeEnum.nullable().optional(),
  first_name: z.string().nullable().optional(),
  last_name: z.string().nullable().optional(),
  email: z.string().nullable().optional(),
  mobile: z.string().nullable().optional(),
  page_index: z.number().int().min(1).default(1).optional(),
  page_size: z.number().int().min(1).max(100).default(10).optional(),
  ordering: z.string().nullable().optional()
});
export const adminUpateUserTypeSchema = z.object({ type: userTypeEnum });

export type LoginOutSchema = z.infer<typeof loginOutSchema>;
