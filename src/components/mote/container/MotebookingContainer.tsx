import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import Side from "../../../sider/Side";
import MotebookingSkjemaContainer from "./MotebookingSkjemaContainer";
import MotestatusContainer from "./MotestatusContainer";
import Feilmelding from "../../Feilmelding";
import { MOETEPLANLEGGER } from "@/enums/menypunkter";
import { hentBegrunnelseTekst } from "@/utils/tilgangUtils";
import { useValgtPersonident } from "@/hooks/useValgtBruker";
import { hentMoter } from "@/data/mote/moter_actions";
import { useAppSelector } from "@/hooks/hooks";
import SideLaster from "@/components/SideLaster";

const texts = {
  pageTitle: "Møteplanlegger",
  errorTitle: "Du har ikke tilgang til denne tjenesten",
};

export const MotebookingContainer = () => {
  const fnr = useValgtPersonident();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(hentMoter(fnr));
  }, [dispatch, fnr]);

  const { ledere, moter } = useAppSelector((state) => state);
  const harForsoktHentetAlt = moter.hentingForsokt && ledere.hentingForsokt;
  const hentingFeilet = moter.hentingFeilet || ledere.hentingFeilet;
  const aktivtMote = moter.data.find((mote) => {
    return mote.status !== "AVBRUTT";
  });

  return (
    <Side tittel={texts.pageTitle} aktivtMenypunkt={MOETEPLANLEGGER}>
      <SideLaster henter={!harForsoktHentetAlt} hentingFeilet={hentingFeilet}>
        {(() => {
          if (moter.tilgang?.harTilgang === false) {
            return (
              <Feilmelding
                tittel={texts.errorTitle}
                melding={hentBegrunnelseTekst(moter.tilgang.begrunnelse)}
              />
            );
          }
          if (aktivtMote) {
            return (
              <MotestatusContainer fnr={fnr} moteUuid={aktivtMote.moteUuid} />
            );
          }
          return <MotebookingSkjemaContainer fnr={fnr} />;
        })()}
      </SideLaster>
    </Side>
  );
};
