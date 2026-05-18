const TOKEN_KEY = "authToken";
const USER_KEY = "authUser";

function readStorageValue(key) {
  return localStorage.getItem(key) || sessionStorage.getItem(key) || "";
}

export function getAuthToken() {
  return readStorageValue(TOKEN_KEY);
}

export function getAuthUser() {
  const rawUser = readStorageValue(USER_KEY);

  if (!rawUser) return null;

  try {
    return JSON.parse(rawUser);
  } catch {
    return null;
  }
}

export function setAuthSession({ token, user, rememberMe = false }) {
  localStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  sessionStorage.removeItem(USER_KEY);

  const storage = rememberMe ? localStorage : sessionStorage;

  storage.setItem(TOKEN_KEY, token);

  if (user) {
    storage.setItem(USER_KEY, JSON.stringify(user));
  }
}

export function clearAuthSession() {
  localStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  sessionStorage.removeItem(USER_KEY);
}
