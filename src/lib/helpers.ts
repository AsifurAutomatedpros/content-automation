export function getFromLocalStorage(key: string): string | null {
  if (typeof window !== "undefined") {
    return window.localStorage.getItem(key);
  }
  return null;
}

export function removeFromLocalStorage(key: string): void | null {
  if (typeof window !== "undefined") {
    return window.localStorage.removeItem(key);
  }
  return null;
}

export function setToLocalStorage(key: string, value: string): void {
  if (typeof window !== "undefined") {
    return window.localStorage.setItem(key, value);
  }
}

export function getFromSessionStorage(key: string): string | null {
  if (typeof sessionStorage !== "undefined") {
    return sessionStorage.getItem(key);
  }
  return null;
}

export function setToSessionStorage(key: string, value: string): void {
  if (typeof sessionStorage !== "undefined") {
    return sessionStorage.setItem(key, value);
  }
}
