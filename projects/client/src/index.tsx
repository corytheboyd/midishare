import * as React from "react";
import { render } from "react-dom";
import { QueryClientProvider } from "react-query";
import { queryClient } from "./lib/queryClient";
import { ReactQueryDevtools } from "react-query/devtools";
import { App } from "./views/App";

render(
  <QueryClientProvider client={queryClient}>
    <ReactQueryDevtools initialIsOpen={true} />
    <App />
  </QueryClientProvider>,
  document.getElementById("root")
);

/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-ignore
if (module.hot) module.hot.accept();
/* eslint-enable @typescript-eslint/ban-ts-comment */
