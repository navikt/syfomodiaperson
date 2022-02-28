import React, { useState } from "react";

type ValgtEnhetProviderProps = {
  children: React.ReactNode;
};

type ValgtEnhetContextState = {
  setValgtEnhet: (enhetId: string) => void;
  valgtEnhet: string;
};

export const ValgtEnhetContext = React.createContext<
  ValgtEnhetContextState | undefined
>(undefined);

export const ValgtEnhetProvider = ({ children }: ValgtEnhetProviderProps) => {
  const [valgtEnhet, setValgtEnhet] = useState<string>("");
  return (
    <ValgtEnhetContext.Provider
      value={{
        valgtEnhet,
        setValgtEnhet,
      }}
    >
      {children}
    </ValgtEnhetContext.Provider>
  );
};

export const useValgtEnhet = () => {
  const context = React.useContext(ValgtEnhetContext);
  if (!context) {
    throw new Error(`useValgtEnhet must be used within a ValgtEnhetProvider`);
  }
  return context;
};
