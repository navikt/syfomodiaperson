import React, { useCallback } from "react";
import NAVSPA from "@navikt/navspa";
import { DecoratorProps } from "./decoratorProps";
import decoratorConfig from "./decoratorConfig";
import { useValgtPersonident } from "@/hooks/useValgtBruker";
import { useValgtEnhet } from "@/context/ValgtEnhetContext";

const InternflateDecorator = NAVSPA.importer<DecoratorProps>(
  "internarbeidsflatefs"
);

const Decorator = () => {
  const { setValgtEnhet } = useValgtEnhet();

  const fnr = useValgtPersonident();

  const handlePersonsokSubmit = () => {
    if (window.location.pathname.includes("personsok")) {
      window.location.href = "/sykefravaer";
    } else {
      window.location.reload();
    }
  };

  const handleChangeEnhet = (nyEnhet: string) => {
    setValgtEnhet(nyEnhet);
  };

  const config = useCallback(decoratorConfig, [
    fnr,
    handlePersonsokSubmit,
    handleChangeEnhet,
  ])(fnr, handlePersonsokSubmit, handleChangeEnhet);

  return <InternflateDecorator {...config} />;
};

export default Decorator;
