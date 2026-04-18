import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import { toast } from "sonner";
import { useAuthStore } from "@/stores/auth-store";
import type {
  AdminUpateUserTypeSchema,
  AdminUserFilterSchema,
  ChangePasswordInSchema,
  EmailInSchema,
  ErrorResponse,
  LoginInSchema,
  LoginOutSchema,
  MonitorFilterSchema,
  MonitorInSchema,
  MonitorOutSchema,
  MonitorStateHistoryFilterSchema,
  PagedMonitorOutSchema,
  PagedMonitorStateHistoryOutSchema,
  PagedUserOutSchema,
  PasswordResetConfirmInSchema,
  PasswordResetValidateInSchema,
  RegisterUserInSchema,
  Response,
  SystemSettingsInSchema,
  SystemSettingsOutSchema,
  SystemSettingsUpdateSchema,
  TelegramLinkOutSchema,
  TelegramWebhookResponseSchema,
  UserOutSchema,
  VerifyEmailOTPInSchema,
  MonitorUpdateSchema
} from "@/types/api";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export const api = axios.create({
  baseURL: API_BASE_URL
});

let isRefreshing = false;
let failedQueue: Array<() => void> = [];

const processQueue = () => {
  failedQueue.forEach((cb) => cb());
  failedQueue = [];
};

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ErrorResponse>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    if (error.response?.status === 401 && !originalRequest?._retry) {
      if (isRefreshing) {
        return new Promise((resolve) => {
          failedQueue.push(() => resolve(api(originalRequest)));
        });
      }
      originalRequest._retry = true;
      isRefreshing = true;
      try {
        await api.post("/api/v1/auth/token/refresh/");
        isRefreshing = false;
        processQueue();
        return api(originalRequest);
      } catch {
        useAuthStore.getState().clearAuth();
        if (typeof window !== "undefined") window.location.href = "/login";
      } finally {
        isRefreshing = false;
      }
    }
    const message = error.response?.data?.message || `Request failed (${error.response?.data?.code ?? "unknown"})`;
    toast.error(message);
    return Promise.reject(error);
  }
);

const q = <T extends Record<string, unknown>>(params?: T) => ({ params });

export const authApi = {
  registerUser: (body: RegisterUserInSchema) => api.post<LoginOutSchema>("/api/v1/auth/register/user/", body).then((r) => r.data),
  requestEmailOtp: (body: EmailInSchema) => api.post<Response>("/api/v1/auth/register/email-otp/", body).then((r) => r.data),
  verifyEmailOtp: (body: VerifyEmailOTPInSchema) => api.post<LoginOutSchema>("/api/v1/auth/register/email-otp/verify/", body).then((r) => r.data),
  login: (body: LoginInSchema) => api.post<LoginOutSchema>("/api/v1/auth/login/", body).then((r) => r.data),
  googleAuth: (state: string, code?: string | null, err?: string | null) =>
    api.get<LoginOutSchema>("/api/v1/auth/login/google/", q({ state, code, error: err })).then((r) => r.data),
  passwordResetRequest: (body: EmailInSchema) => api.post<Response>("/api/v1/auth/password-reset/", body).then((r) => r.data),
  passwordResetValidate: (body: PasswordResetValidateInSchema) =>
    api.post<Response>("/api/v1/auth/passoword-reset/validate/", body).then((r) => r.data),
  passwordResetDone: (body: PasswordResetConfirmInSchema) => api.post<Response>("/api/v1/auth/password-reset/done/", body).then((r) => r.data),
  changePassword: (body: ChangePasswordInSchema) => api.post<Response>("/api/v1/auth/change-password/", body).then((r) => r.data),
  refreshToken: () => api.post<Response>("/api/v1/auth/token/refresh/").then((r) => r.data),
  logout: () => api.post<void>("/api/v1/auth/logout/").then((r) => r.data)
};

export const userApi = {
  me: () => api.get<UserOutSchema>("/api/v1/user/").then((r) => r.data)
};

export const telegramApi = {
  connect: () => api.get<TelegramLinkOutSchema>("/api/v1/messaging/telegram/connect/").then((r) => r.data),
  webhook: (body: unknown) => api.post<TelegramWebhookResponseSchema>("/api/v1/messaging/telegram/webhook/", body).then((r) => r.data)
};

export const monitorsApi = {
  create: (body: MonitorInSchema) => api.post<MonitorOutSchema>("/api/v1/monitoring/", body).then((r) => r.data),
  list: (params?: MonitorFilterSchema) => api.get<PagedMonitorOutSchema>("/api/v1/monitoring/", q(params)).then((r) => r.data),
  detail: (monitor_uuid: string) => api.get<MonitorOutSchema>(`/api/v1/monitoring/${monitor_uuid}/`).then((r) => r.data),
  update: (monitor_uuid: string, body: MonitorUpdateSchema) => api.put<MonitorOutSchema>(`/api/v1/monitoring/${monitor_uuid}/`, body).then((r) => r.data),
  remove: (monitor_uuid: string) => api.delete<void>(`/api/v1/monitoring/${monitor_uuid}/`).then((r) => r.data),
  history: (params?: MonitorStateHistoryFilterSchema) =>
    api.get<PagedMonitorStateHistoryOutSchema>("/api/v1/monitoring/history/", q(params)).then((r) => r.data)
};

export const backofficeApi = {
  getSettings: () => api.get<SystemSettingsOutSchema>("/api/v1/backoffice/system_settings/").then((r) => r.data),
  createSettings: (body: SystemSettingsInSchema) => api.post<SystemSettingsOutSchema>("/api/v1/backoffice/system_settings/", body).then((r) => r.data),
  updateSettings: (uuid: string, body: SystemSettingsUpdateSchema) =>
    api.put<SystemSettingsOutSchema>(`/api/v1/backoffice/system_settings/${uuid}/`, body).then((r) => r.data),
  listUsers: (params?: AdminUserFilterSchema) => api.get<PagedUserOutSchema>("/api/v1/backoffice/users/", q(params)).then((r) => r.data),
  getUser: (user_uuid: string) => api.get<UserOutSchema>(`/api/v1/backoffice/users/users/${user_uuid}/`).then((r) => r.data),
  updateUserType: (user_uuid: string, body: AdminUpateUserTypeSchema) =>
    api.patch<UserOutSchema>(`/api/v1/backoffice/users/users/${user_uuid}/type/`, body).then((r) => r.data)
};
