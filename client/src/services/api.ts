import axios, { AxiosError } from "axios";

function resolveBaseUrl(): string {
  const envUrl =
    (import.meta as any)?.env?.VITE_API_BASE_URL ||
    (typeof process !== "undefined" && (process as any)?.env?.REACT_APP_API_BASE_URL);
  if (envUrl && typeof envUrl === "string" && envUrl.trim()) return envUrl.replace(/\/+$/, "");
  if (typeof window !== "undefined") {
    const isLocalhost = ["localhost","127.0.0.1","::1"].includes(window.location.hostname);
    return isLocalhost ? "http://localhost:5000" : window.location.origin;
  }
  return "http://localhost:5000";
}
const API_BASE_URL = resolveBaseUrl();

const TOKEN_KEY = "access_token";
export function getToken(): string | null { try { return localStorage.getItem(TOKEN_KEY); } catch { return null; } }
export function setToken(token: string): void { try { localStorage.setItem(TOKEN_KEY, token); } catch {} }
export function clearToken(): void { try { localStorage.removeItem(TOKEN_KEY); } catch {} }
export function isAuthed(): boolean { return !!getToken(); }

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 20_000,
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers = config.headers ?? {};
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
    if (err.response?.status === 401) {
      console.warn("[HTTP] 401 from", err.config?.url);
      clearToken();
      if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
        // window.location.href = '/login'; // enable if you want auto-redirect
      }
    }
    return Promise.reject(err);
  }
);

export async function json<T = unknown>(path: string, init?: { method?: string; data?: any }): Promise<T> {
  const method = init?.method ?? (init?.data ? "POST" : "GET");
  console.log("[HTTP] json", method, path, init?.data ? "(with body)" : "");
  const res = await api.request<T>({ url: path, method, data: init?.data });
  return res.data;
}

export async function fetchJSON<T = unknown>(url: string, init: { method?: string; body?: any } = {}): Promise<T> {
  let data = init.body;
  if (typeof data === "string") { try { data = JSON.parse(data); } catch {} }
  const method = init.method ?? (data !== undefined ? "POST" : "GET");
  console.log("[HTTP] fetchJSON", method, url, data ? "(with body)" : "");
  const res = await api.request<T>({ url, method, data });
  return res.data;
}

export const safe = <A extends any[]>(fn: (...args: A) => Promise<any>) => (...args: A): void => { void fn(...args); };

export default api;
