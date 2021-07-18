import { setupAxiosInstance } from "services/api";

export function persistAuth(auth) {
  if (!auth) {
    localStorage.clear();
  } else {
    setupAxiosInstance(auth.token);
    localStorage.setItem("auth", JSON.stringify(auth));
  }
}

export function loadAuth() {
  const persistedAuth = localStorage.getItem("auth");

  if (!persistedAuth) {
    return null;
  }

  const asJson = JSON.parse(persistedAuth);
  setupAxiosInstance(asJson.token);
  return asJson;
}

export function persistCompletion(completion) {
  if (!completion)
    localStorage.removeItem("completion")
  else
    localStorage.setItem("completion", JSON.stringify(completion))
}

export function loadCompletion() {
  const persistedCompletion = localStorage.getItem("completion");

  if (!persistedCompletion) return null;

  const asJson = JSON.parse(persistedCompletion);
  return asJson
}