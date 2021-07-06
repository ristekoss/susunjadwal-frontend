import React from "react";
import { Route, Switch, Redirect } from "react-router";
import { useSelector } from "react-redux";
import { ThemeProvider } from "styled-components";

import Login from "./containers/Login";
import BuildSchedule from "./containers/BuildSchedule";
import Header from "./containers/Header";
import ViewSchedule from "./containers/ViewSchedule";
import NotFoundPage from "./containers/NotFoundPage";
import Logout from "./containers/Logout";
import ScheduleList from "./containers/ScheduleList";
import EditSchedule from "./containers/EditSchedule";
import Footer from "containers/Footer";
import Landing from "containers/Landing";
import BetaForm from "containers/BetaForm";
import BetaLanding from "containers/BetaLanding";
import { Box } from "@chakra-ui/react";

const PROTECTED_ROUTES = [
  { path: "/susun", component: BuildSchedule, auth: true },
  { path: "/jadwal/:scheduleId", component: ViewSchedule, auth: false },
  { path: "/jadwal", component: ScheduleList, auth: true },
  { path: "/logout", component: Logout, auth: true },
  { path: "/edit/:scheduleId", component: EditSchedule, auth: true },
];

const NonProtectedRoute = ({ path, name, component, exact=false }) => (
  <Box
    pt="120px"
    mb={{base:16,md:'108px'}}
    px={{ base: 6, lg: "122px" }}
  >
    <Route
      path={path}
      name={name}
      component={component}
      exact={exact}
    />
  </Box>
)

function Routes() {
  const isMobile = useSelector((state) => state.appState.isMobile);

  return (
    <ThemeProvider theme={{ mobile: isMobile }}>
        <Switch>
          <NonProtectedRoute path="/" name="login" component={Login} exact />
          <NonProtectedRoute path="/beta" name="beta" component={BetaLanding} />
          <NonProtectedRoute path="/beta-form" name="beta-form" component={BetaForm} />
          <Route component={RoutesWithNavbar} />
        </Switch>
      <Footer />
    </ThemeProvider>
  );
}

function RoutesWithNavbar() {
  return (
    <div>
      <Header />
        <Switch>
          {PROTECTED_ROUTES.map((route) => {
            const Component = route.auth ? PrivateRoute : Route;
            return (
              <Box
                pt="120px"
                mb={{base:16,md:'108px'}}
                px={{ base: 6, lg: "122px" }}
              >
                <Component key={route.path} {...route} />
              </Box>
            )
          })}
          <Route component={NotFoundPage} />
        </Switch>
    </div>
  );
}

function PrivateRoute({ component: Component, ...rest }) {
  const auth = useSelector((state) => state.auth);

  return (
    <Route
      {...rest}
      render={(props) =>
        auth ? (
          <Component {...props} />
        ) : (
          <Redirect to={{ pathname: "/", state: { from: props.location } }} />
        )
      }
    />
  );
}

export default Routes;