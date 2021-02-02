import * as React from "react";
import { render } from "react-dom";
import { QueryClientProvider } from "react-query";
import { queryClient } from "./lib/queryClient";
import { ReactQueryDevtools } from "react-query/devtools";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Home } from "./views/pages/Home";
import { CreateSession } from "./views/pages/CreateSession";

render(
  <QueryClientProvider client={queryClient}>
    <ReactQueryDevtools initialIsOpen={true} />
    <Router>
      <Switch>
        <Route path="/control-center">
          <CreateSession />
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
