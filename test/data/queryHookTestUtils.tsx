import { QueryClient, QueryClientProvider } from "react-query";
import { Provider } from "react-redux";
import React from "react";
import configureStore from "redux-mock-store";
import { ARBEIDSTAKER_DEFAULT } from "../../mock/common/mockConstants";

const store = configureStore([]);
const mockState = {
  valgtbruker: {
    personident: ARBEIDSTAKER_DEFAULT.personIdent,
  },
};

export const queryHookWrapper = (client: QueryClient) => {
  const wrapper = ({ children }) => (
    <Provider store={store({ ...mockState })}>
      <QueryClientProvider client={client}>{children}</QueryClientProvider>
    </Provider>
  );

  return wrapper;
};
