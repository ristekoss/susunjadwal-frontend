import config from "config";
import { useMixpanel } from "hooks/useMixpanel";

const { SSO_UI_URL, DOMAIN, BASE_URL } = config;

const loginUrl = `${SSO_UI_URL}/login?service=${DOMAIN}${BASE_URL}`;
const logoutUrl = `${SSO_UI_URL}/logout?url=${DOMAIN}${BASE_URL}`;

export function redirectToSSOLogin() {
  useMixpanel.track("login_click", {
    eventName: "login_click",
    eventAction: "click",
    eventCategory: "Login",
    fieldName: "auth_method: SSO",
    screenName: "/susun",
    screenOwner: "desktop_web",
    eventLabel: "/susun::login-sso-click",
  });
  window.location.replace(loginUrl);
}

export function redirectToSSOLogout() {
  useMixpanel.track("logout");
  window.location.replace(logoutUrl);
}
