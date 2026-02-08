import api, { setToken } from "./api";

export async function login(email: string, password: string) {
  const { data } = await api.post("/api/auth/login", { email, password });

  if (!data?.token) throw new Error("No token returned");
  setToken(data.token); // localStorage["access_token"]

  return data.user; // optional
}

/**
 * Signup should not require a token unless you intentionally auto-login on signup.
 * This matches the common UX: signup -> show success -> login.
 */
export async function signup(firstName: string, lastName: string, email: string, password: string) {
  const { data } = await api.post("/api/auth/signup", { firstName, lastName, email, password });

  // Backend may return { user } or { message, user }
  return data?.user ?? data;
}
