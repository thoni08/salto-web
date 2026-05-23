const TOKEN_KEY = "authToken";
const USER_KEY = "authUser";

function readStorageValue(key) {
  return localStorage.getItem(key) || sessionStorage.getItem(key) || "";
}

function getAuthStorage() {
  if (localStorage.getItem(TOKEN_KEY) || localStorage.getItem(USER_KEY)) {
    return localStorage;
  }

  if (sessionStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(USER_KEY)) {
    return sessionStorage;
  }

  return null;
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

export function updateAuthUser(user) {
  const storage = getAuthStorage();

  if (!storage) {
    return;
  }

  if (user) {
    storage.setItem(USER_KEY, JSON.stringify(user));
  } else {
    storage.removeItem(USER_KEY);
  }

  window.dispatchEvent(new Event("storage"));
}
