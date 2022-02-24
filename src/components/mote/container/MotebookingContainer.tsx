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
import { useLedereQuery } from "@/data/leder/ledereQueryHooks";

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

  const {
    isLoading: henterLedere,
    isError: henterLedereFeilet,
  } = useLedereQuery();
  const { moter } = useAppSelector((state) => state);
  const henter = !moter.hentingForsokt || henterLedere;
  const hentingFeilet = moter.hentingFeilet || henterLedereFeilet;
  const aktivtMote = moter.data.find((mote) => {
    return mote.status !== "AVBRUTT";
  });

  return (
    <Side tittel={texts.pageTitle} aktivtMenypunkt={MOETEPLANLEGGER}>
      <SideLaster henter={henter} hentingFeilet={hentingFeilet}>
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
