import Side from "../../../../components/side/Side";
import React, { ReactElement } from "react";
import Sidetopp from "../../../../components/side/Sidetopp";
import SideLaster from "../../../../components/side/SideLaster";
import { BrukerKanIkkeVarslesPapirpostAdvarsel } from "@/sider/dialogmoter/components/BrukerKanIkkeVarslesPapirpostAdvarsel";
import { useDialogmoterQuery } from "@/sider/dialogmoter/hooks/dialogmoteQueryHooks";
import { Navigate } from "react-router-dom";
import { moteoversiktRoutePath } from "@/AppRouter";
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
import { Alert } from "@navikt/ds-react";

const texts = {
  title: "Innkalling til dialogmøte",
  tilbake: "Tilbake",
  ikkeSykmeldtAlert:
    "Denne funksjonaliteten skal kun benyttes på sykmeldte som følges opp etter kapittel 8 i folketrygdloven. Du kan sende innkalling selv om den sykmeldte ikke har digital sykmelding.",
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
  const { hasActiveOppfolgingstilfelle } = useOppfolgingstilfellePersonQuery();

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

        {!hasActiveOppfolgingstilfelle && (
          <Alert
            variant="warning"
            size="small"
            className="mb-4 [&>*]:max-w-fit"
          >
            {texts.ikkeSykmeldtAlert}
          </Alert>
        )}

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
