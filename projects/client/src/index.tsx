import * as React from "react";
import { render } from "react-dom";
import { QueryClientProvider } from "react-query";
import { queryClient } from "./lib/queryClient";
import { ReactQueryDevtools } from "react-query/devtools";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Helmet } from "react-helmet";
import { Routes } from "./views/routes";
import { HomePage } from "./views/pages/HomePage";
import { SessionShowPage } from "./views/pages/Sessions/Show";
import { SessionJoinPage } from "./views/pages/Sessions/SessionJoinPage";
import { NotFound } from "./views/pages/NotFound";
import { SessionIndexPage } from "./views/pages/Sessions/Index";

render(
  <QueryClientProvider client={queryClient}>
    <ReactQueryDevtools initialIsOpen={true} />
    <Helmet>
      <title>Midishare</title>
    </Helmet>
    <Router>
      <Switch>
        <Route path={Routes.SESSION_JOIN}>
          <SessionJoinPage />
        </Route>
        <Route path={Routes.SESSION}>
          <SessionShowPage />
        </Route>
        <Route path={Routes.SESSIONS}>
          <SessionIndexPage />
        </Route>
        <Route exact path={Routes.HOME}>
          <HomePage />
        </Route>
        <Route path="*">
          <NotFound />
        </Route>
      </Switch>
    </Router>
  </QueryClientProvider>,
  document.getElementById("root")
);

/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-ignore
if (module.hot) module.hot.accept();
/* eslint-enable @typescript-eslint/ban-ts-comment */
