import { QueryClient, QueryClientProvider } from "react-query";
import React from "react";
import { modiacontextQueryKeys } from "@/data/modiacontext/modiacontextQueryHooks";
import { AKTIV_BRUKER_DEFAULT } from "../../mock/common/mockConstants";

export const queryHookWrapper = (client: QueryClient) => {
  client.setQueryData(
    modiacontextQueryKeys.aktivbruker,
    () => AKTIV_BRUKER_DEFAULT
  );
  const wrapper = ({ children }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );

  return wrapper;
};
