import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import Side from "../../../sider/Side";
import * as oppdialogActions from "../../../data/oppfolgingsplan/oppfoelgingsdialoger_actions";
import OppfolgingsplanerOversikt from "../oppfoelgingsdialoger/OppfolgingsplanerOversikt";
import IngenPlaner from "../oppfoelgingsdialoger/IngenPlaner";
import { OPPFOELGINGSPLANER } from "@/enums/menypunkter";
import { activeOppfolgingsplaner } from "@/utils/oppfolgingsplanerUtils";
import { hentOppfolgingsplanerLPS } from "@/data/oppfolgingsplan/oppfolgingsplanerlps_actions";
import { hentPersonOppgaver } from "@/data/personoppgave/personoppgave_actions";
import SideLaster from "../../SideLaster";
import { useValgtPersonident } from "@/hooks/useValgtBruker";
import { useAppSelector } from "@/hooks/hooks";
import { useOppfoelgingsDialoger } from "@/hooks/useOppfoelgingsDialoger";

export const OppfoelgingsPlanerOversiktContainer = () => {
  const dispatch = useDispatch();
  const fnr = useValgtPersonident();
  const {
    harForsoktHentetOppfoelgingsdialoger,
    oppfoelgingsdialoger,
    oppfoelgingsdialogerHentingFeilet,
  } = useOppfoelgingsDialoger();
  const {
    data: personOppgaver,
    hentingFeilet: personoppgaverHentingFeilet,
    hentingForsokt: personoppgaverHentingForsokt,
  } = useAppSelector((state) => state.personoppgaver);
  const {
    data: oppfolgingsplanerLPS,
    hentingFeilet: oppfolgingsplanerLPSHentingFeilet,
    hentingForsokt: oppfolgingsplanerLPSHentingForsokt,
  } = useAppSelector((state) => state.oppfolgingsplanerlps);

  const harForsoktHentetAlt =
    harForsoktHentetOppfoelgingsdialoger &&
    (personoppgaverHentingFeilet || oppfolgingsplanerLPSHentingForsokt) &&
    personoppgaverHentingForsokt;
  const henter = !harForsoktHentetAlt;

  const hentingFeilet =
    oppfoelgingsdialogerHentingFeilet ||
    oppfolgingsplanerLPSHentingFeilet ||
    personoppgaverHentingFeilet;

  const aktiveDialoger = activeOppfolgingsplaner(oppfoelgingsdialoger);
  const inaktiveDialoger = oppfoelgingsdialoger.filter(
    (dialog) => !aktiveDialoger.includes(dialog)
  );

  useEffect(() => {
    dispatch(oppdialogActions.hentOppfoelgingsdialoger(fnr));
    dispatch(hentOppfolgingsplanerLPS(fnr));
    dispatch(hentPersonOppgaver(fnr));
  }, [dispatch, fnr]);

  useEffect(() => {
    dispatch(hentOppfolgingsplanerLPS(fnr));
  }, [dispatch, fnr, personOppgaver]);

  return (
    <Side tittel="Oppfølgingsplaner" aktivtMenypunkt={OPPFOELGINGSPLANER}>
      <SideLaster henter={henter} hentingFeilet={hentingFeilet}>
        {(() => {
          if (
            aktiveDialoger.length === 0 &&
            inaktiveDialoger.length === 0 &&
            oppfolgingsplanerLPS.length === 0
          ) {
            return <IngenPlaner />;
          }
          return (
            <OppfolgingsplanerOversikt
              aktiveDialoger={aktiveDialoger}
              inaktiveDialoger={inaktiveDialoger}
              oppfolgingsplanerLPS={oppfolgingsplanerLPS}
              fnr={fnr}
            />
          );
        })()}
      </SideLaster>
    </Side>
  );
};
