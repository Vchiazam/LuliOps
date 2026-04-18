export type IssueCode =
  | "400"
  | "401"
  | "402"
  | "403"
  | "404"
  | "405"
  | "406"
  | "407"
  | "408"
  | "409"
  | "500"
  | "428";
export type MonitorState = "healthy" | "degraded" | "down" | [x: any];
export type MonitorType = "http" | "tcp" | "ping";
export type UserType = "admin" | "operator" | "viewer" | "ghost";

export interface ErrorResponse {
  message?: string | null;
  success?: boolean;
  code: IssueCode;
}

export interface Response<T = unknown> {
  message?: string | null;
  success?: boolean;
  data?: T;
}

export interface UserOutSchema {
  mobile?: string | null;
  profile_picture?: string | null;
  uuid?: string;
  first_name?: string | null;
  last_name?: string | null;
  alias?: string | null;
  use_alias?: boolean;
  email: string;
  type?: UserType;
  date_created: string;
  email_verified?: boolean;
  has_completed_sign_up?: boolean;
}

export interface LoginOutSchema {
  token: string;
  profile: UserOutSchema;
}

export interface RegisterUserInSchema {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  mobile: string;
  alias?: string | null;
  use_alias?: boolean | null;
}

export interface VerifyEmailOTPInSchema {
  email: string;
  otp: string;
}

export interface EmailInSchema {
  email: string;
}

export interface LoginInSchema {
  email: string;
  password: string;
}

export interface PasswordResetValidateInSchema {
  token: string;
  uid: string;
}

export interface PasswordResetConfirmInSchema extends PasswordResetValidateInSchema {
  new_password: string;
}

export interface ChangePasswordInSchema {
  new_password: string;
  old_password: string;
}

export interface TelegramLinkOutSchema {
  link: string;
}

export interface TelegramWebhookResponseSchema {
  ok?: boolean;
}

export interface MonitorOutSchema {
  uuid?: string;
  name: string;
  type: MonitorType;
  target: string;
  is_active?: boolean;
  current_state?: MonitorState;
  last_downtime_at?: string | null;
  last_alert_state?: string | null;
  consecutive_healthy?: number;
  date_created: string;
}

export interface MonitorInSchema {
  name: string;
  type: MonitorType;
  target: string;
  is_active: boolean;
  current_state: MonitorState;
}

export interface MonitorUpdateSchema {
  name?: string | null;
  target?: string | null;
  type?: MonitorType | null;
  is_active?: boolean | null;
}

export interface MonitorFilterSchema {
  current_state?: MonitorState | null;
  target?: string | null;
  type?: MonitorType | null;
  is_active?: boolean | null;
  page_index?: number;
  page_size?: number;
  ordering?: string | null;
}

export interface MonitorStateHistoryOutSchema {
  monitor: MonitorOutSchema;
  uuid?: string;
  previous_state: string;
  new_state: string;
  latency_ms?: number | null;
  jitter_ms?: number | null;
  packet_loss?: number | null;
  success?: boolean;
  error_message?: string | null;
  date_created: string;
}

export interface MonitorStateHistoryFilterSchema {
  uuid?: string | null;
  monitor_id?: string | null;
  previous_state?: MonitorState | null;
  new_state?: MonitorState | null;
  page_index?: number;
  page_size?: number;
  ordering?: string | null;
}

export interface Paged<T> {
  message?: string | null;
  success?: boolean;
  total: number;
  page_size: number;
  page_index: number;
  nb_pages: number;
  previous: string | null;
  next: string | null;
  data: T[];
}

export type PagedMonitorOutSchema = Paged<MonitorOutSchema>;
export type PagedMonitorStateHistoryOutSchema =
  Paged<MonitorStateHistoryOutSchema>;
export type PagedUserOutSchema = Paged<UserOutSchema>;

export interface SystemSettingsOutSchema {
  uuid?: string;
  alert_emails?: Record<string, unknown> | null;
  telegram_chat_ids?: Record<string, unknown> | null;
  combine_alerts?: boolean;
  combine_window_seconds?: number;
  date_created: string;
}

export interface SystemSettingsInSchema {
  alert_emails?: unknown[] | null;
  telegram_chat_ids?: unknown[] | null;
  combine_alerts?: boolean | null;
  combine_window_seconds?: number | null;
}

export interface SystemSettingsUpdateSchema extends SystemSettingsInSchema {}

export interface AdminUserFilterSchema {
  type?: UserType | null;
  first_name?: string | null;
  last_name?: string | null;
  email?: string | null;
  mobile?: string | null;
  page_index?: number;
  page_size?: number;
  ordering?: string | null;
}

export interface AdminUpateUserTypeSchema {
  type: UserType;
}
