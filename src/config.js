const config = {
  base: {
    DOMAIN: window.location.origin,
    SSO_UI_URL: "https://sso.ui.ac.id/cas2"
  },
  production: {
    API_BASE_URL: "https://ristek.cs.ui.ac.id/susunjadwal/api",
    BASE_URL: "/"
  },
  development: {
    API_BASE_URL: "http://localhost:5000/susunjadwal/api",
    BASE_URL: "/",
    AIRTABLE_BASE_ID: process.env.REACT_APP_BETA_AIRTABLE_BASE_ID,
    AIRTABLE_API_KEY: process.env.REACT_APP_BETA_AIRTABLE_API_KEY,
    AIRTABLE_TABLE_NAME: 'beta-tester'
  }
};

export default {
  ...config.base,
  ...config[process.env.NODE_ENV || "development"]
};
