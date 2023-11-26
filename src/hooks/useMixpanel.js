import mixpanel from "mixpanel-browser";

mixpanel.init(process.env.REACT_APP_MIXPANEL_PROJECT_TOKEN, {
  debug: true,
  persistence: "localStorage",
  track_pageview: true,
});

let env_check = true;

let actions = {
  identify: (id) => {
    if (env_check) mixpanel.identify(id);
  },
  alias: (id) => {
    if (env_check) mixpanel.alias(id);
  },
  track: (name, props) => {
    if (env_check) mixpanel.track(name, props);
  },
  people: {
    set: (props) => {
      if (env_check) mixpanel.people.set(props);
    },
  },
};

export let useMixpanel = actions;
