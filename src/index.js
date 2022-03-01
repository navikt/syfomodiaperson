import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import AppRouter from "./routers/AppRouter";
import { setupStore } from "./data/store";
import "./styles/styles.less";
import { initAmplitude } from "./amplitude/amplitude";
import * as Sentry from "@sentry/react";
import { getEnvironmentAsString } from "./utils/miljoUtil";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { minutesToMillis } from "@/utils/timeUtils";
import { ValgtEnhetProvider } from "@/context/ValgtEnhetContext";

const store = setupStore();

initAmplitude();
Sentry.init({
  dsn: "https://8ea71ab742104cd5ad7d9d488023f28d@sentry.gc.nav.no/84",
  environment: getEnvironmentAsString(),
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      cacheTime: minutesToMillis(60),
      staleTime: minutesToMillis(30),
    },
  },
});

ReactDOM.render(
  <Provider store={store}>
    <ValgtEnhetProvider>
      <QueryClientProvider client={queryClient}>
        <AppRouter />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </ValgtEnhetProvider>
  </Provider>,
  document.getElementById("maincontent")
);

export { store };
