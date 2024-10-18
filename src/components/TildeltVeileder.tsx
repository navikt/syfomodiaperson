import React, { useState } from "react";
import {
  Alert,
  BodyShort,
  Button,
  Modal,
  Tag,
  UNSAFE_Combobox,
} from "@navikt/ds-react";
import { useGetVeilederBrukerKnytning } from "@/data/veilederbrukerknytning/useGetVeilederBrukerKnytning";
import {
  useAktivVeilederinfoQuery,
  useVeiledereForValgtEnhetQuery,
  useVeilederInfoQuery,
} from "@/data/veilederinfo/veilederinfoQueryHooks";
import { useValgtEnhet } from "@/context/ValgtEnhetContext";
import { useTildelVeileder } from "@/data/veilederbrukerknytning/useTildelVeileder";
import { Veileder } from "@/data/veilederinfo/types/Veileder";
import { SkjemaInnsendingFeil } from "@/components/SkjemaInnsendingFeil";
import styled from "styled-components";
import * as Amplitude from "@/utils/amplitude";
import { EventType } from "@/utils/amplitude";

const texts = {
  tildeltVeileder: "Tildelt veileder: ",
  ufordelt: "Ufordelt bruker",
  button: "Endre",
  modal: {
    heading: "Tildel veileder",
    hentVeiledereFailed: "Noe gikk galt ved henting av veiledere",
    combobox: {
      label: "Velg veileder fra enhet",
      description1: "Her tildeler du innbyggeren til en veileder på din enhet.",
      description2: "Tildeling av enkelthendelser er ikke mulig.",
      missingVeileder: "Vennligst velg veileder",
    },
    alert:
      "Tildelingen gjelder kun i Modia SYFO, ikke i Arena eller Modia Arbeidsrettet oppfølging",
    cancel: "Avbryt",
    tildel: "Tildel",
  },
};

interface VeilederNavnProps {
  tildeltVeilederident: string;
}

function VeilederNavn({ tildeltVeilederident }: VeilederNavnProps) {
  const { isLoading, data: veilederInfo } =
    useVeilederInfoQuery(tildeltVeilederident);

  return !isLoading ? (
    <span>
      {veilederInfo
        ? `${veilederInfo?.fulltNavn()} (${tildeltVeilederident})`
        : tildeltVeilederident}
    </span>
  ) : (
    <span></span>
  );
}

interface ChangeTildeltVeilederModalProps {
  open: boolean;
  handleClose: () => void;
}

const toVeilederOption = (veileder: Veileder) => ({
  value: veileder.ident,
  label: `${veileder.etternavn}, ${veileder.fornavn}`,
});

const toVeilederOptions = (veiledere: Veileder[], aktivVeileder: Veileder) => {
  const sortedVeiledere = veiledere.sort((veilederA, veilederB) => {
    const etternavn1 = veilederA.etternavn.toLowerCase();
    const etternavn2 = veilederB.etternavn.toLowerCase();
    const fornavn1 = veilederA.fornavn.toLowerCase();
    const fornavn2 = veilederB.fornavn.toLowerCase();

    return etternavn1 === etternavn2
      ? fornavn1.localeCompare(fornavn2)
      : etternavn1.localeCompare(etternavn2);
  });

  return [
    toVeilederOption(aktivVeileder),
    ...sortedVeiledere
      .filter(
        (veileder) =>
          veileder.fornavn.length > 0 && veileder.etternavn.length > 0
      )
      .filter((veileder) => veileder.ident !== aktivVeileder.ident)
      .map(toVeilederOption),
  ];
};

const StyledCombobox = styled(UNSAFE_Combobox)`
  .navds-combobox__list {
    max-height: 15rem;
  }
`;

function ChangeTildeltVeilederModal({
  open,
  handleClose,
}: ChangeTildeltVeilederModalProps) {
  const [isError, setIsError] = useState(false);
  const { valgtEnhet } = useValgtEnhet();
  const { data: aktivVeileder, isLoading: henterAktivVeileder } =
    useAktivVeilederinfoQuery();
  const tildelVeileder = useTildelVeileder();
  const [selectedVeilederIdent, setSelectedVeilederIdent] = useState<
    string | undefined
  >();
  const {
    isLoading: henterVeiledere,
    isError: hentVeilederFeilet,
    data: veiledere,
  } = useVeiledereForValgtEnhetQuery();

  const henterVeilederData = henterAktivVeileder || henterVeiledere;
  const harVeiledere = !!veiledere && !!aktivVeileder;
  const options = harVeiledere
    ? toVeilederOptions(veiledere, aktivVeileder)
    : [];

  const selectedOptions = () => {
    const selectedOption = options.find(
      (option) => option.value === selectedVeilederIdent
    );
    return selectedOption ? [selectedOption] : [];
  };

  const handleVeilederSelected = (option: string, isSelected: boolean) => {
    if (isSelected) {
      setSelectedVeilederIdent(option);
      setIsError(false);
    } else {
      setSelectedVeilederIdent(undefined);
    }
  };

  const handleTildelVeileder = () => {
    if (selectedVeilederIdent) {
      tildelVeileder.mutate(selectedVeilederIdent, {
        onSuccess: () => {
          Amplitude.logEvent({
            type: EventType.ButtonClick,
            data: {
              tekst: "Tildelt veileder",
              url: window.location.href,
            },
          });
          handleClose();
        },
      });
    } else {
      setIsError(true);
    }
  };

  return (
    <Modal
      className="h-2/3 justify-between"
      header={{ heading: texts.modal.heading }}
      open={open}
      onClose={handleClose}
    >
      <Modal.Body className="flex flex-col gap-8 flex-1">
        {hentVeilederFeilet && (
          <Alert variant="error" size="small">
            {texts.modal.hentVeiledereFailed}
          </Alert>
        )}
        <Alert variant="warning" size="small">
          {texts.modal.alert}
        </Alert>
        <StyledCombobox
          shouldAutocomplete
          isLoading={henterVeilederData}
          label={`${texts.modal.combobox.label} ${valgtEnhet}`}
          description={
            <>
              <BodyShort>{texts.modal.combobox.description1}</BodyShort>
              <BodyShort>{texts.modal.combobox.description2}</BodyShort>
            </>
          }
          selectedOptions={selectedOptions()}
          onToggleSelected={handleVeilederSelected}
          options={options}
          error={isError && texts.modal.combobox.missingVeileder}
        />
      </Modal.Body>
      <Modal.Footer>
        {tildelVeileder.isError && (
          <SkjemaInnsendingFeil error={tildelVeileder.error} />
        )}
        <Button
          onClick={handleTildelVeileder}
          loading={tildelVeileder.isPending}
        >
          {texts.modal.tildel}
        </Button>
        <Button variant="secondary" onClick={handleClose}>
          {texts.modal.cancel}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

function ChangeTildeltVeileder() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <Button className="ml-4" size="small" onClick={() => setModalOpen(true)}>
        {texts.button}
      </Button>
      {modalOpen && (
        <ChangeTildeltVeilederModal
          open={modalOpen}
          handleClose={() => setModalOpen(false)}
        />
      )}
    </>
  );
}

export function TildeltVeileder() {
  const veilederBrukerKnytningQuery = useGetVeilederBrukerKnytning();
  const veilederIdent = veilederBrukerKnytningQuery.data?.tildeltVeilederident;
  return veilederBrukerKnytningQuery.isSuccess ? (
    <div className="ml-auto">
      <b>{texts.tildeltVeileder}</b>
      {veilederIdent ? (
        <VeilederNavn tildeltVeilederident={veilederIdent} />
      ) : (
        <Tag variant="info" size="small">
          {texts.ufordelt}
        </Tag>
      )}
      <ChangeTildeltVeileder />
    </div>
  ) : (
    <span />
  );
}
