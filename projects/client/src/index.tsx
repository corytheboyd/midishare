import * as React from "react";
import { render } from "react-dom";
import { QueryClientProvider } from "react-query";
import { queryClient } from "./lib/queryClient";
import { ReactQueryDevtools } from "react-query/devtools";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Helmet } from "react-helmet";
import { Routes } from "./views/routes";
import { HomePage } from "./views/pages/HomePage";
import { SessionIndexPage } from "./views/pages/SessionIndexPage";
import { SessionPage } from "./views/pages/SessionPage";

// TODO MOVE THIS WS STUFF OUTTA HERE
const ws = new WebSocket(process.env.WS_URL as string);
ws.addEventListener("message", function (event) {
  console.debug("WS MESSAGE", event.data);
});
ws.addEventListener("open", function () {
  console.debug("WS OPEN", this);
});

render(
  <QueryClientProvider client={queryClient}>
    <ReactQueryDevtools initialIsOpen={true} />
    <Helmet>
      <title>Midishare</title>
    </Helmet>
    <Router>
      <Switch>
        <Route path={Routes.SESSION}>
          <SessionPage />
        </Route>
        <Route path={Routes.SESSIONS}>
          <SessionIndexPage />
        </Route>
        <Route path={Routes.HOME}>
          <HomePage />
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
