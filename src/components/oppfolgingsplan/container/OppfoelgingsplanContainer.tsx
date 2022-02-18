import React from "react";
import SideFullbredde from "../../../sider/SideFullbredde";
import Oppfolgingsplan from "../oppfolgingsplaner/Oppfolgingsplan";
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
    data: oppfolgingsplaner,
    isError: oppfolgingsplanerHentingFeilet,
    isLoading: henterOppfolgingsplaner,
  } = useOppfolgingsplanerQuery();
  const henter = henterOppfolgingsplaner || henterVeilederinfo;
  const oppfolgingsplan = oppfolgingsplaner.find((plan) => {
    return plan.id === parseInt(oppfoelgingsdialogId, 10);
  });

  return (
    <SideFullbredde tittel={texts.tittel} aktivtMenypunkt={OPPFOELGINGSPLANER}>
      <SideLaster
        henter={henter}
        hentingFeilet={oppfolgingsplanerHentingFeilet}
      >
        {oppfolgingsplan ? (
          <Oppfolgingsplan oppfolgingsplan={oppfolgingsplan} />
        ) : (
          <Feilmelding tittel={texts.notFound} />
        )}
      </SideLaster>
    </SideFullbredde>
  );
};
