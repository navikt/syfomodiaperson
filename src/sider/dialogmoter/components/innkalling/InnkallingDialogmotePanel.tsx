import React, { ReactElement } from "react";
import { MoteIkonBlaaImage } from "../../../../../img/ImageComponents";
import DialogmotePanel from "../DialogmotePanel";
import DialogmoteMoteStatusPanel from "./DialogmoteMoteStatusPanel";
import { BrukerKanIkkeVarslesPapirpostAdvarsel } from "@/sider/dialogmoter/components/BrukerKanIkkeVarslesPapirpostAdvarsel";
import { DialogmoteDTO } from "@/sider/dialogmoter/types/dialogmoteTypes";
import { useDialogmotekandidat } from "@/data/dialogmotekandidat/dialogmotekandidatQueryHooks";
import { useKontaktinfoQuery } from "@/data/navbruker/navbrukerQueryHooks";
import { useOppfolgingstilfellePersonQuery } from "@/data/oppfolgingstilfelle/person/oppfolgingstilfellePersonQueryHooks";
import { Alert, BodyShort, Button } from "@navikt/ds-react";
import {
  dialogmoteRoutePath,
  dialogmoteUnntakRoutePath,
  dialogmoteIkkeAktuellRoutePath,
} from "@/routers/AppRouter";
import { Link } from "react-router-dom";
import { DialogmoteFrist } from "@/sider/dialogmoter/components/DialogmoteFrist";

const texts = {
  bekreftetMote: "Bekreftet møte",
  seMotestatus: "Se møtestatus",
  planleggNyttMote: "Planlegg nytt dialogmøte",
  kandidatDialogmote: "Kandidat til dialogmøte",
  ingenMoterPlanlagt: "Ingen møter planlagt",
  dialogMote: "Dialogmøte",
  moteforesporselSendt: "Møteforespørsel sendt",
  settUnntakButton: "Sett unntak",
  nyttMote: "Nytt dialogmøte",
  ikkeAktuell: "Ikke aktuell",
  ikkeSykmeldtAlert:
    "Denne funksjonaliteten skal kun benyttes på sykmeldte som følges opp etter kapittel 8 i folketrygdloven. Du kan sende innkalling selv om den sykmeldte ikke har digital sykmelding.",
};

function NyttDialogmoteButton() {
  return (
    <Button as={Link} to={dialogmoteRoutePath} variant={"primary"}>
      {texts.nyttMote}
    </Button>
  );
}

function SettUnntakButton() {
  return (
    <Button as={Link} to={dialogmoteUnntakRoutePath} variant="secondary">
      {texts.settUnntakButton}
    </Button>
  );
}

function IkkeAktuellButton() {
  return (
    <Button as={Link} to={dialogmoteIkkeAktuellRoutePath} variant="secondary">
      {texts.ikkeAktuell}
    </Button>
  );
}

interface Props {
  aktivtDialogmote: DialogmoteDTO | undefined;
}

export default function InnkallingDialogmotePanel({
  aktivtDialogmote,
}: Props): ReactElement {
  const { brukerKanIkkeVarslesDigitalt } = useKontaktinfoQuery();
  const { hasActiveOppfolgingstilfelle } = useOppfolgingstilfellePersonQuery();
  const { isKandidat } = useDialogmotekandidat();

  if (aktivtDialogmote) {
    return <DialogmoteMoteStatusPanel dialogmote={aktivtDialogmote} />;
  } else {
    return (
      <DialogmotePanel
        icon={MoteIkonBlaaImage}
        header={isKandidat ? texts.kandidatDialogmote : texts.planleggNyttMote}
        subtitle={
          <>
            <BodyShort size="small">{texts.ingenMoterPlanlagt}</BodyShort>
            <DialogmoteFrist />
          </>
        }
      >
        {brukerKanIkkeVarslesDigitalt && (
          <BrukerKanIkkeVarslesPapirpostAdvarsel />
        )}
        {!hasActiveOppfolgingstilfelle && (
          <Alert
            variant="warning"
            size="small"
            className="mb-4 [&>*]:max-w-fit"
          >
            {texts.ikkeSykmeldtAlert}
          </Alert>
        )}

        <div className="flex flex-row gap-4">
          <NyttDialogmoteButton />
          {isKandidat && <SettUnntakButton />}
          {isKandidat && <IkkeAktuellButton />}
        </div>
      </DialogmotePanel>
    );
  }
}
