import React from "react";
import SideFullbredde from "../../../sider/SideFullbredde";
import Oppfolgingsplan from "../oppfoelgingsdialoger/Oppfolgingsplan";
import { OPPFOELGINGSPLANER } from "@/enums/menypunkter";
import SideLaster from "../../SideLaster";
import { useParams } from "react-router-dom";
import Feilmelding from "@/components/Feilmelding";
import { useVeilederinfoQuery } from "@/data/veilederinfo/veilederinfoQueryHooks";
import { useOppfolgingsplanerQuery } from "@/data/oppfolgingsplan/oppfolgingsplanQueryHooks";

const texts = {
  tittel: "Oppfølgingsplan",
  notFound: "Fant ikke oppfølgingsplan",
};

export const OppfoelgingsplanContainer = () => {
  const { oppfoelgingsdialogId } = useParams<{
    oppfoelgingsdialogId: string;
  }>();
  const { isLoading: henterVeilederinfo } = useVeilederinfoQuery();
  const {
    data: oppfoelgingsdialoger,
    isError: oppfoelgingsdialogerHentingFeilet,
    isLoading: henterOppfoelgingsdialoger,
  } = useOppfolgingsplanerQuery();
  const henter = henterOppfoelgingsdialoger || henterVeilederinfo;
  const oppfoelgingsdialog = oppfoelgingsdialoger.find((dialog) => {
    return dialog.id === parseInt(oppfoelgingsdialogId, 10);
  });

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
