const config = {
  base: {
    DOMAIN: window.location.origin,
    SSO_UI_URL: "https://sso.ui.ac.id/cas2"
  },
  production: {
    API_BASE_URL: "https://ristek.cs.ui.ac.id/susunjadwal/api",
    BASE_URL: "/susunjadwal/"
  },
  development: {
    API_BASE_URL: "http://localhost:5000/susunjadwal/api",
    BASE_URL: "/"
  }
};

export default {
  ...config.base,
  ...config[process.env.NODE_ENV || "development"]
};
