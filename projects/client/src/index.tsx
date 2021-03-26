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

import * as Sentry from "@sentry/react";
import { Integrations } from "@sentry/tracing";
Sentry.init({
  dsn:
    "https://bf4b72ca8af148e4a6b4a7e6837bf90b@o559557.ingest.sentry.io/5694457",
  integrations: [new Integrations.BrowserTracing()],

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,

  release: process.env.GIT_REV || process.env.NODE_ENV,
  environment: process.env.NODE_ENV,
});

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
if (module.hot) {
  // @ts-ignore
  module.hot.dispose((...args) => {
    console.info("HMR: disposing component", args);
  });

  // @ts-ignore
  module.hot.accept((...args) => {
    console.info("HMR: accept updated component", args);
  });
}
/* eslint-enable @typescript-eslint/ban-ts-comment */
