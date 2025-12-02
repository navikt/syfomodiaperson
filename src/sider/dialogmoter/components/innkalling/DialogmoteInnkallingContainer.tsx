import Side from "../../../../components/side/Side";
import React, { ReactElement } from "react";
import Sidetopp from "../../../../components/side/Sidetopp";
import SideLaster from "../../../../components/side/SideLaster";
import { BrukerKanIkkeVarslesPapirpostAdvarsel } from "@/sider/dialogmoter/components/BrukerKanIkkeVarslesPapirpostAdvarsel";
import { useDialogmoterQuery } from "@/sider/dialogmoter/hooks/dialogmoteQueryHooks";
import { Navigate } from "react-router-dom";
import { moteoversiktRoutePath } from "@/routers/AppRouter";
import { useLedereQuery } from "@/data/leder/ledereQueryHooks";
import { useOppfolgingstilfellePersonQuery } from "@/data/oppfolgingstilfelle/person/oppfolgingstilfellePersonQueryHooks";
import { useKontaktinfoQuery } from "@/data/navbruker/navbrukerQueryHooks";
import * as Tredelt from "@/components/side/TredeltSide";
import MotehistorikkPanel from "@/sider/dialogmoter/components/motehistorikk/MotehistorikkPanel";
import { useGetDialogmoteunntakQuery } from "@/data/dialogmotekandidat/useGetDialogmoteunntakQuery";
import { Menypunkter } from "@/components/globalnavigasjon/GlobalNavigasjon";
import { MalformProvider } from "@/context/malform/MalformContext";
import DialogmoteInnkallingSkjema from "@/sider/dialogmoter/components/innkalling/DialogmoteInnkallingSkjema";
import MotebehovHistorikk from "@/sider/dialogmoter/components/motehistorikk/MotebehovHistorikk";
import { useGetDialogmoteIkkeAktuell } from "@/sider/dialogmoter/hooks/useGetDialogmoteIkkeAktuell";

const texts = {
  title: "Innkalling til dialogmøte",
  tilbake: "Tilbake",
};

function DialogmoteInnkallingSide(): ReactElement {
  const { brukerKanIkkeVarslesDigitalt } = useKontaktinfoQuery();

  return (
    <div className="flex flex-col">
      {brukerKanIkkeVarslesDigitalt && (
        <BrukerKanIkkeVarslesPapirpostAdvarsel />
      )}
      <DialogmoteInnkallingSkjema />
    </div>
  );
}

export default function DialogmoteInnkallingContainer(): ReactElement {
  const { isLoading: henterLedere, isError: hentingLedereFeilet } =
    useLedereQuery();
  const { aktivtDialogmote, historiskeDialogmoter } = useDialogmoterQuery();
  const { data: dialogmoteunntak } = useGetDialogmoteunntakQuery();
  const { data: dialogmoteikkeaktuell } = useGetDialogmoteIkkeAktuell();
  const {
    isLoading: henterOppfolgingstilfeller,
    isError: hentingOppfolgingstilfellerFeilet,
  } = useOppfolgingstilfellePersonQuery();

  if (aktivtDialogmote) {
    return <Navigate to={moteoversiktRoutePath} />;
  }

  const henter = henterLedere || henterOppfolgingstilfeller;
  const hentingFeilet =
    hentingLedereFeilet || hentingOppfolgingstilfellerFeilet;

  return (
    <Side tittel={texts.title} aktivtMenypunkt={Menypunkter.DIALOGMOTE}>
      <SideLaster isLoading={henter} isError={hentingFeilet}>
        <Sidetopp tittel={texts.title} />
        <Tredelt.Container>
          <Tredelt.FirstColumn>
            <MalformProvider>
              <DialogmoteInnkallingSide />
            </MalformProvider>
          </Tredelt.FirstColumn>
          <Tredelt.SecondColumn className="flex flex-col gap-4">
            <MotehistorikkPanel
              historiskeMoter={historiskeDialogmoter}
              dialogmoteunntak={dialogmoteunntak}
              dialogmoteikkeaktuell={dialogmoteikkeaktuell}
            />
            <MotebehovHistorikk />
          </Tredelt.SecondColumn>
        </Tredelt.Container>
      </SideLaster>
    </Side>
  );
}
