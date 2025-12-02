import React from "react";
import SideFullbredde from "../../../components/side/SideFullbredde";
import Oppfolgingsplan from "../oppfolgingsplaner/Oppfolgingsplan";
import SideLaster from "../../../components/side/SideLaster";
import { useParams } from "react-router-dom";
import Feilmelding from "@/components/Feilmelding";
import { useAktivVeilederinfoQuery } from "@/data/veilederinfo/veilederinfoQueryHooks";
import { useGetOppfolgingsplanerQuery } from "@/data/oppfolgingsplan/oppfolgingsplanQueryHooks";

const texts = {
  tittel: "Oppfølgingsplan",
  notFound: "Fant ikke oppfølgingsplan",
};

export default function OppfolgingsplanContainer() {
  const { oppfoelgingsdialogId } = useParams<{
    oppfoelgingsdialogId: string;
  }>();
  const { isLoading: henterVeilederinfo } = useAktivVeilederinfoQuery();
  const getOppfolgingsplanerQuery = useGetOppfolgingsplanerQuery();
  const henter = getOppfolgingsplanerQuery.isLoading || henterVeilederinfo;
  const oppfolgingsplan = getOppfolgingsplanerQuery.data.find((plan) => {
    return (
      oppfoelgingsdialogId && plan.id === parseInt(oppfoelgingsdialogId, 10)
    );
  });

  return (
    <SideFullbredde tittel={texts.tittel}>
      <SideLaster
        isLoading={henter}
        isError={getOppfolgingsplanerQuery.isError}
      >
        {oppfolgingsplan ? (
          <Oppfolgingsplan oppfolgingsplan={oppfolgingsplan} />
        ) : (
          <Feilmelding tittel={texts.notFound} />
        )}
      </SideLaster>
    </SideFullbredde>
  );
}
