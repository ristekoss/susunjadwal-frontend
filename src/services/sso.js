import config from "config";

const { SSO_UI_URL, DOMAIN, BASE_URL } = config;

const loginUrl = `${SSO_UI_URL}/login?service=${DOMAIN}${BASE_URL}`;
const logoutUrl = `${SSO_UI_URL}/logout?url=${DOMAIN}${BASE_URL}`;

export function redirectToSSOLogin() {
  window.location.replace(loginUrl);
}

export function redirectToSSOLogout() {
  window.location.replace(logoutUrl);
}
