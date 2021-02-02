import * as React from "react";
import { render } from "react-dom";
import { QueryClientProvider } from "react-query";
import { queryClient } from "./lib/queryClient";
import { ReactQueryDevtools } from "react-query/devtools";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Home } from "./views/pages/Home";
import { Sessions } from "./views/pages/Sessions";
import { Helmet } from "react-helmet";

render(
  <QueryClientProvider client={queryClient}>
    <ReactQueryDevtools initialIsOpen={true} />
    <Helmet>
      <title>Midishare</title>
    </Helmet>
    <Router>
      <Switch>
        <Route path="/control-center">
          <Sessions />
        </Route>
        <Route path="/">
          <Home />
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
