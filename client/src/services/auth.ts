import api, { setToken } from "../services/api";

export async function login(email: string, password: string) {
  const { data } = await api.post("/api/auth/login", { email, password });
  if (!data?.token) throw new Error("No token returned");
  setToken(data.token); // stores to localStorage["access_token"]
  return data.user;     // optional return
}

export async function signup(firstName: string, lastName: string, email: string, password: string) {
  const { data } = await api.post("/api/auth/signup", { firstName, lastName, email, password });
  if (!data?.token) throw new Error("No token returned");
  setToken(data.token);
  return data.user;
}
