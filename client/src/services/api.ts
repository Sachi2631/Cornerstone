import axios, { AxiosError } from "axios";

function normalizeBaseUrl(url: string): string {
  return url.replace(/\/+$/, "");
}

function resolveBaseUrl(): string {
  const envUrl =
    (typeof process !== "undefined" &&
      (process.env.REACT_APP_API_BASE_URL as string | undefined)) ||
    "";

  if (envUrl && typeof envUrl === "string" && envUrl.trim()) {
    return normalizeBaseUrl(envUrl.trim());
  }

  if (typeof window !== "undefined") {
    const isLocalhost = ["localhost", "127.0.0.1", "::1"].includes(window.location.hostname);
    return isLocalhost ? "http://localhost:5001" : window.location.origin;
  }

  return "http://localhost:5001";
}

const API_BASE_URL = resolveBaseUrl();
console.log("[HTTP] API_BASE_URL =", API_BASE_URL);

const TOKEN_KEY = "access_token";

export function getToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setToken(token: string): void {
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch {
    // ignore
  }
}

export function clearToken(): void {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch {
    // ignore
  }
}

export function isAuthed(): boolean {
  return !!getToken();
}

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 20_000,
});

function isPublicAuthEndpoint(url?: string) {
  if (!url) return false;
  // handles "/api/auth/login" and also full urls if axios ever receives them
  return url.includes("/api/auth/login") || url.includes("/api/auth/signup");
}

api.interceptors.request.use((config) => {
  const token = getToken();
  config.headers = config.headers ?? {};

  // IMPORTANT: don't attach token for login/signup
  if (token && !isPublicAuthEndpoint(config.url)) {
    (config.headers as any).Authorization = `Bearer ${token}`;
    console.log("[HTTP] attach token: YES", config.method?.toUpperCase(), config.url);
  } else {
    console.log("[HTTP] attach token: NO", config.method?.toUpperCase(), config.url);
  }

  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err: AxiosError<any>) => {
    const status = err.response?.status;
    const url = err.config?.url;

    if (status === 401) {
      console.warn("[HTTP] 401 from", url);

      // If a protected route 401s, the token is not usable (missing/expired/secret mismatch)
      // Clear and force user to auth screen
      if (!isPublicAuthEndpoint(url)) {
        clearToken();
        if (typeof window !== "undefined" && window.location.pathname !== "/auth") {
          window.location.href = "/auth";
        }
      }
    }

    return Promise.reject(err);
  }
);

export async function json<T = unknown>(
  path: string,
  init?: { method?: string; data?: any }
): Promise<T> {
  const method = init?.method ?? (init?.data ? "POST" : "GET");
  console.log("[HTTP] json", method, path, init?.data ? "(with body)" : "");
  const res = await api.request<T>({ url: path, method, data: init?.data });
  return res.data;
}

export async function fetchJSON<T = unknown>(
  url: string,
  init: { method?: string; body?: any } = {}
): Promise<T> {
  let data = init.body;

  if (typeof data === "string") {
    try {
      data = JSON.parse(data);
    } catch {
      // ignore
    }
  }

  const method = init.method ?? (data !== undefined ? "POST" : "GET");
  console.log("[HTTP] fetchJSON", method, url, data ? "(with body)" : "");
  const res = await api.request<T>({ url, method, data });
  return res.data;
}

export const safe =
  <A extends any[]>(fn: (...args: A) => Promise<any>) =>
  (...args: A): void => {
    void fn(...args);
  };

export default api;