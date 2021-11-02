import { QueryClient, QueryClientProvider } from "react-query";
import { Provider } from "react-redux";
import React from "react";
import configureStore from "redux-mock-store";

export const personident = "05087321470";
const store = configureStore([]);
const mockState = {
  valgtbruker: {
    personident,
  },
};

export const queryHookWrapper = (client: QueryClient, extraState?: any) => {
  const wrapper = ({ children }) => (
    <Provider store={store({ ...mockState, ...extraState })}>
      <QueryClientProvider client={client}>{children}</QueryClientProvider>
    </Provider>
  );

  return wrapper;
};
