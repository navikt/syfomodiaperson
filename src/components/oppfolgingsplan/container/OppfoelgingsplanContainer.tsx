import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import SideFullbredde from "../../../sider/SideFullbredde";
import * as oppdialogActions from "../../../data/oppfolgingsplan/oppfoelgingsdialoger_actions";
import Oppfolgingsplan from "../oppfoelgingsdialoger/Oppfolgingsplan";
import { OPPFOELGINGSPLANER } from "@/enums/menypunkter";
import SideLaster from "../../SideLaster";
import { useValgtPersonident } from "@/hooks/useValgtBruker";
import { useParams } from "react-router-dom";
import Feilmelding from "@/components/Feilmelding";
import { useOppfoelgingsDialoger } from "@/hooks/useOppfoelgingsDialoger";
import { useVeilederinfoQuery } from "@/data/veilederinfo/veilederinfoQueryHooks";

const texts = {
  tittel: "Oppfølgingsplan",
  notFound: "Fant ikke oppfølgingsplan",
};

export const OppfoelgingsplanContainer = () => {
  const { oppfoelgingsdialogId } = useParams<{
    oppfoelgingsdialogId: string;
  }>();
  const fnr = useValgtPersonident();
  const { isLoading: henterVeilederinfo } = useVeilederinfoQuery();
  const dispatch = useDispatch();
  const {
    oppfoelgingsdialoger,
    oppfoelgingsdialogerHentingFeilet,
    harForsoktHentetOppfoelgingsdialoger,
  } = useOppfoelgingsDialoger();
  const henter = !harForsoktHentetOppfoelgingsdialoger || henterVeilederinfo;
  const oppfoelgingsdialog = oppfoelgingsdialoger.find((dialog) => {
    return dialog.id === parseInt(oppfoelgingsdialogId, 10);
  });

  useEffect(() => {
    dispatch(oppdialogActions.hentOppfoelgingsdialoger(fnr));
  }, [dispatch, fnr]);

  return (
    <SideFullbredde tittel={texts.tittel} aktivtMenypunkt={OPPFOELGINGSPLANER}>
      <SideLaster
        henter={henter}
        hentingFeilet={oppfoelgingsdialogerHentingFeilet}
      >
        {oppfoelgingsdialog ? (
          <Oppfolgingsplan oppfolgingsplan={oppfoelgingsdialog} />
        ) : (
          <Feilmelding tittel={texts.notFound} />
        )}
      </SideLaster>
    </SideFullbredde>
  );
};
