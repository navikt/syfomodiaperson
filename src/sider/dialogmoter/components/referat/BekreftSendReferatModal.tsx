import { ReactElement, ReactNode } from "react";
import { BodyShort, Button, Label, Modal, VStack } from "@navikt/ds-react";
import { DialogmoteDTO } from "@/sider/dialogmoter/types/dialogmoteTypes";
import { useNavBrukerData } from "@/data/navbruker/navbruker_hooks";
import { useVirksomhetQuery } from "@/data/virksomhet/virksomhetQueryHooks";
import { formaterFnr } from "@/utils/fnrUtils";
import { formatDateTimeWithComma } from "@/utils/datoUtils";

export const texts = {
  heading: "Sjekk at referatet gjelder riktig person",
  intro: "Referatet blir sendt til disse mottakerne:",
  arbeidstaker: "Arbeidstaker",
  mote: "Møte",
  arbeidsgiver: "Arbeidsgiver",
  behandler: "Behandler",
  behandlerMottarIkkeReferat: "mottar ikke referatet",
  orgnr: "org.nr.",
  fnr: "f.nr.",
  bekreft: "Ja, send referatet",
  avbryt: "Avbryt",
};

interface Props {
  dialogmote: DialogmoteDTO;
  naermesteLeder: string;
  behandlerMottarReferat: boolean | undefined;
  isPending: boolean;
  onBekreft: () => void;
  onAvbryt: () => void;
  onClose: () => void;
}

interface MottakerProps {
  label: string;
  children: ReactNode;
}

function Mottaker({ label, children }: MottakerProps): ReactElement {
  return (
    <div>
      <Label as="dt" size="small">
        {label}
      </Label>
      <BodyShort as="dd">{children}</BodyShort>
    </div>
  );
}

export function BekreftSendReferatModal({
  dialogmote,
  naermesteLeder,
  behandlerMottarReferat,
  isPending,
  onBekreft,
  onAvbryt,
  onClose,
}: Props): ReactElement {
  const navbruker = useNavBrukerData();
  const { virksomhetsnavn } = useVirksomhetQuery(
    dialogmote.arbeidsgiver.virksomhetsnummer,
  );
  const arbeidsgiver =
    virksomhetsnavn ??
    `${texts.orgnr} ${dialogmote.arbeidsgiver.virksomhetsnummer}`;
  const behandler = dialogmote.behandler;

  return (
    <Modal
      open
      closeOnBackdropClick
      onClose={onClose}
      header={{ heading: texts.heading, size: "medium" }}
      width="medium"
    >
      <Modal.Body>
        <VStack gap="space-16">
          <BodyShort>{texts.intro}</BodyShort>
          <VStack as="dl" gap="space-12">
            <Mottaker label={texts.arbeidstaker}>
              <strong>{navbruker.navn}</strong>
              {`, ${texts.fnr} ${formaterFnr(dialogmote.arbeidstaker.personIdent)}`}
            </Mottaker>
            <Mottaker label={texts.arbeidsgiver}>
              {`${naermesteLeder}, ${arbeidsgiver}`}
            </Mottaker>
            {behandler && (
              <Mottaker label={texts.behandler}>
                {behandlerMottarReferat === false
                  ? `${behandler.behandlerNavn} (${texts.behandlerMottarIkkeReferat})`
                  : behandler.behandlerNavn}
              </Mottaker>
            )}
            <Mottaker label={texts.mote}>
              {`${formatDateTimeWithComma(dialogmote.tid)}, ${dialogmote.sted}`}
            </Mottaker>
          </VStack>
        </VStack>
      </Modal.Body>
      <Modal.Footer>
        <Button
          type="button"
          variant="primary"
          loading={isPending}
          onClick={onBekreft}
        >
          {texts.bekreft}
        </Button>
        <Button type="button" variant="secondary" onClick={onAvbryt}>
          {texts.avbryt}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
