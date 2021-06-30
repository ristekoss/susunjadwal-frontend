import React from "react";
import styled from "styled-components";
import { Route, Switch, Redirect } from "react-router";
import { useSelector } from "react-redux";
import { ThemeProvider } from "styled-components";

// import Login from "./containers/Login";
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
import { Box } from "@chakra-ui/react";

const ROUTES = [
  { path: "/susun", component: BuildSchedule, auth: true },
  { path: "/jadwal/:scheduleId", component: ViewSchedule, auth: false },
  { path: "/jadwal", component: ScheduleList, auth: true },
  { path: "/logout", component: Logout, auth: true },
  { path: "/edit/:scheduleId", component: EditSchedule, auth: true },
];

function Routes() {
  const isMobile = useSelector((state) => state.appState.isMobile);

  return (
    <ThemeProvider theme={{ mobile: isMobile }}>
      <Box pt="120px" px={{ base: 6, lg: "122px" }}>
        <Switch>
          <Route path="/" name="home" component={Landing} exact />
          <Route path="/beta-form" name="beta-form" component={BetaForm} />
          <Route component={RoutesWithNavbar} />
        </Switch>
      </Box>
      <Footer />
    </ThemeProvider>
  );
}

function RoutesWithNavbar() {
  return (
    <div>
      <Header />
      <ComponentWrapper>
        <Switch>
          {ROUTES.map((route) => {
            const Component = route.auth ? PrivateRoute : Route;
            return <Component key={route.path} {...route} />;
          })}
          <Route component={NotFoundPage} />
        </Switch>
      </ComponentWrapper>
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
const ComponentWrapper = styled.div`
  padding-top: 64px;
`;
export default Routes;
