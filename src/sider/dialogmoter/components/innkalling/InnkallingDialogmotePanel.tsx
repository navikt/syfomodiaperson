import React, { ReactElement } from "react";
import { FlexGapSize, FlexRow } from "@/components/Layout";
import { MoteIkonBlaaImage } from "../../../../../img/ImageComponents";
import { DialogmotePanel } from "../DialogmotePanel";
import { DialogmoteMoteStatusPanel } from "./DialogmoteMoteStatusPanel";
import { BrukerKanIkkeVarslesPapirpostAdvarsel } from "@/sider/dialogmoter/components/BrukerKanIkkeVarslesPapirpostAdvarsel";
import { DialogmoteDTO } from "@/data/dialogmote/types/dialogmoteTypes";
import { useDialogmotekandidat } from "@/data/dialogmotekandidat/dialogmotekandidatQueryHooks";
import { useKontaktinfoQuery } from "@/data/navbruker/navbrukerQueryHooks";
import { ArbeidstakerHarIkkeAktivSykmeldingAdvarsel } from "@/sider/dialogmoter/components/ArbeidstakerHarIkkeAktivSykmelding";
import { useOppfolgingstilfellePersonQuery } from "@/data/oppfolgingstilfelle/person/oppfolgingstilfellePersonQueryHooks";
import { BodyShort, Button } from "@navikt/ds-react";
import {
  dialogmoteRoutePath,
  dialogmoteUnntakRoutePath,
  dialogmoteIkkeAktuellRoutePath,
} from "@/routers/AppRouter";
import { Link } from "react-router-dom";
import { DialogmoteFrist } from "@/sider/dialogmoter/components/DialogmoteFrist";

export const texts = {
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
};

const dialogmotePanelHeaderText = (isKandidat: boolean): string => {
  return isKandidat ? texts.kandidatDialogmote : texts.planleggNyttMote;
};

interface InnkallingDialogmotePanelProps {
  aktivtDialogmote: DialogmoteDTO | undefined;
}

export const InnkallingDialogmotePanel = ({
  aktivtDialogmote,
}: InnkallingDialogmotePanelProps): ReactElement => {
  const { brukerKanIkkeVarslesDigitalt } = useKontaktinfoQuery();
  const { hasActiveOppfolgingstilfelle } = useOppfolgingstilfellePersonQuery();
  const { isKandidat } = useDialogmotekandidat();

  const NyttDialogmoteButton = () => {
    return (
      <Button as={Link} to={dialogmoteRoutePath} variant={"primary"}>
        {texts.nyttMote}
      </Button>
    );
  };

  const SettUnntakButton = () => {
    return (
      <Button as={Link} to={dialogmoteUnntakRoutePath} variant="secondary">
        {texts.settUnntakButton}
      </Button>
    );
  };
  const IkkeAktuellButton = () => {
    return (
      <Button as={Link} to={dialogmoteIkkeAktuellRoutePath} variant="secondary">
        {texts.ikkeAktuell}
      </Button>
    );
  };

  const Subtitle = () => {
    return (
      <>
        <BodyShort size="small">{texts.ingenMoterPlanlagt}</BodyShort>
        <DialogmoteFrist />
      </>
    );
  };

  if (aktivtDialogmote) {
    return <DialogmoteMoteStatusPanel dialogmote={aktivtDialogmote} />;
  } else {
    return (
      <DialogmotePanel
        icon={MoteIkonBlaaImage}
        header={dialogmotePanelHeaderText(isKandidat)}
        subtitle={<Subtitle />}
      >
        {brukerKanIkkeVarslesDigitalt && (
          <BrukerKanIkkeVarslesPapirpostAdvarsel />
        )}
        {!hasActiveOppfolgingstilfelle && (
          <ArbeidstakerHarIkkeAktivSykmeldingAdvarsel />
        )}

        <FlexRow columnGap={FlexGapSize.MD}>
          <NyttDialogmoteButton />
          {isKandidat && <SettUnntakButton />}
          {isKandidat && <IkkeAktuellButton />}
        </FlexRow>
      </DialogmotePanel>
    );
  }
};
