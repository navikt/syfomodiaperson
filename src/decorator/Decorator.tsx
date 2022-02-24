import React, { useCallback, useEffect } from "react";
import { useDispatch } from "react-redux";
import NAVSPA from "@navikt/navspa";
import { DecoratorProps } from "./decoratorProps";
import decoratorConfig from "./decoratorConfig";
import { valgtEnhet } from "@/data/valgtenhet/enhet_actions";
import { useValgtPersonident } from "@/hooks/useValgtBruker";
import { hentNavbruker } from "@/data/navbruker/navbruker_actions";
import { erGyldigFodselsnummer } from "@/utils/frnValideringUtils";

const InternflateDecorator = NAVSPA.importer<DecoratorProps>(
  "internarbeidsflatefs"
);

const Decorator = () => {
  const dispatch = useDispatch();

  const fnr = useValgtPersonident();

  useEffect(() => {
    if (erGyldigFodselsnummer(fnr)) {
      dispatch(hentNavbruker(fnr));
    }
  }, [dispatch, fnr]);

  const handlePersonsokSubmit = () => {
    window.location.reload();
  };

  const handleChangeEnhet = (nyEnhet: string) => {
    dispatch(valgtEnhet(nyEnhet));
  };

  const config = useCallback(decoratorConfig, [
    fnr,
    handlePersonsokSubmit,
    handleChangeEnhet,
  ])(fnr, handlePersonsokSubmit, handleChangeEnhet);

  return <InternflateDecorator {...config} />;
};

export default Decorator;
