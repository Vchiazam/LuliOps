export const queryKeys = {
  me: ["me"] as const,
  monitors: (params?: unknown) => ["monitors", params] as const,
  monitor: (uuid: string) => ["monitor", uuid] as const,
  history: (params?: unknown) => ["history", params] as const,
  users: (params?: unknown) => ["users", params] as const,
  user: (uuid: string) => ["user", uuid] as const,
  settings: ["settings"] as const,
  telegram: ["telegram"] as const
};
