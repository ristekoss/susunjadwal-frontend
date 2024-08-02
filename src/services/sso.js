import config from "config";
// import { useMixpanel } from "hooks/useMixpanel";

const { SSO_UI_URL, DOMAIN, BASE_URL } = config;

const loginUrl = `${SSO_UI_URL}/login?service=${DOMAIN}${BASE_URL}`;
const logoutUrl = `${SSO_UI_URL}/logout?url=${DOMAIN}${BASE_URL}`;

export function redirectToSSOLogin() {
  // TODO: Re-enable mixpanel or change to other analytics
  // useMixpanel.track("login");
  window.location.replace(loginUrl);
}

export function redirectToSSOLogout() {
  // TODO: Re-enable mixpanel or change to other analytics
  // useMixpanel.track("logout");
  window.location.replace(logoutUrl);
}
