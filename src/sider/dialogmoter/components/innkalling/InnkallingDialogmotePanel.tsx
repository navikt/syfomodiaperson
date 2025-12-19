import React, { ReactElement, useState } from "react";
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
import DialogmoteFrist from "@/sider/dialogmoter/components/DialogmoteFrist";
import { HourglassTopFilledIcon } from "@navikt/aksel-icons";
import { DialogmoteAvventModal } from "./DialogmoteAvventModal";
import { DialogmoteAvventAlert } from "./DialogmoteAvventAlert";

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
  avvent: "Avvent",
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

function AvventDialogmoteButton({ onClick }: { onClick: () => void }) {
  return (
    <Button
      variant="secondary"
      size="small"
      icon={<HourglassTopFilledIcon aria-hidden />}
      onClick={onClick}
    >
      {texts.avvent}
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
  const { isKandidat, avvent } = useDialogmotekandidat();
  const [visAvventModal, setVisAvventModal] = useState(false);

  if (aktivtDialogmote) {
    return <DialogmoteMoteStatusPanel dialogmote={aktivtDialogmote} />;
  } else {
    return (
      <>
        <DialogmoteAvventModal
          isOpen={visAvventModal}
          onClose={() => setVisAvventModal(false)}
        />
        {avvent && <DialogmoteAvventAlert avvent={avvent} />}
        <DialogmotePanel
          icon={MoteIkonBlaaImage}
          header={
            isKandidat ? texts.kandidatDialogmote : texts.planleggNyttMote
          }
          subtitle={
            <>
              <BodyShort size="small">{texts.ingenMoterPlanlagt}</BodyShort>
              <DialogmoteFrist />
            </>
          }
          headerAction={
            isKandidat ? (
              <AvventDialogmoteButton onClick={() => setVisAvventModal(true)} />
            ) : undefined
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
      </>
    );
  }
}
