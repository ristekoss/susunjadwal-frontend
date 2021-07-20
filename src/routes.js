import React from "react";
import { ThemeProvider } from "styled-components";
import { Route, Switch, Redirect } from "react-router";
import { useSelector } from "react-redux";
import { Box } from "@chakra-ui/react";

// import Landing from "containers/Landing"; // uncheck to see component examples
import Login from "./containers/Login";
import BuildSchedule from "./containers/BuildSchedule";
import Header from "./containers/Header";
import ViewSchedule from "./containers/ViewSchedule";
import NotFoundPage from "./containers/NotFoundPage";
import Logout from "./containers/Logout";
import ScheduleList from "./containers/ScheduleList";
import EditSchedule from "./containers/EditSchedule";
import Footer from "containers/Footer";
import BetaForm from "containers/BetaForm";
import BetaLanding from "containers/BetaLanding";
import UpdateCourses from "containers/UpdateCourses";
import { theme } from "styles/StyledTheme";
import CompleteForm from "containers/CompleteForm";

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
    <ThemeProvider theme={{ mobile: isMobile, ...theme }}>
      <Box
        pt="120px"
        mb={{ base: 16, md: "108px" }}
        px={{ base: 6, lg: "80px" }}
        overflowX="hidden !important"
      >
        <Switch>
          <Route path="/" name="home" component={Login} exact />
          <Route path="/beta" name="beta" component={BetaLanding} />
          <Route path="/beta-form" name="beta-form" component={BetaForm} />
          <Route path="/update" name="update-matkul" component={UpdateCourses} />
          <Route path="/complete" name="complete-form" component={CompleteForm} />
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
      <Switch>
        {ROUTES.map((route) => {
          const Component = route.auth ? PrivateRoute : Route;
          return <Component key={route.path} {...route} />;
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
