import React, { useState } from "react";
import { useValgtEnhet } from "@/context/ValgtEnhetContext";
import {
  useAktivVeilederinfoQuery,
  useVeiledereForValgtEnhetQuery,
} from "@/data/veilederinfo/veilederinfoQueryHooks";
import {
  useTildelVeileder,
  VeilederIdent,
} from "@/data/veilederbrukerknytning/useTildelVeileder";
import {
  Alert,
  BodyShort,
  Button,
  Modal,
  UNSAFE_Combobox,
} from "@navikt/ds-react";
import { SkjemaInnsendingFeil } from "@/components/SkjemaInnsendingFeil";
import { Veileder } from "@/data/veilederinfo/types/Veileder";
import styled from "styled-components";

const texts = {
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
  settSomUfordelt: "Sett som ufordelt",
  cancel: "Avbryt",
  tildel: "Tildel",
};

const toVeilederOptions = (
  veiledere: Veileder[],
  aktivVeileder: Veileder
): { label: string; value: VeilederIdent }[] => {
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
          veileder.enabled &&
          veileder.fornavn.length > 0 &&
          veileder.etternavn.length > 0
      )
      .filter((veileder) => veileder.ident !== aktivVeileder.ident)
      .map(toVeilederOption),
  ];
};

const toVeilederOption = (
  veileder: Veileder
): { label: string; value: VeilederIdent } => ({
  value: veileder.ident,
  label: `${veileder.etternavn}, ${veileder.fornavn}`,
});

const StyledCombobox = styled(UNSAFE_Combobox)`
  .navds-combobox__list {
    max-height: 15rem;
  }
`;

interface Props {
  open: boolean;
  handleClose: () => void;
}

export default function EndreTildeltVeilederModal({
  open,
  handleClose,
}: Props) {
  const [isError, setIsError] = useState(false);
  const { valgtEnhet } = useValgtEnhet();
  const { data: aktivVeileder, isLoading: henterAktivVeileder } =
    useAktivVeilederinfoQuery();
  const tildelVeileder = useTildelVeileder();
  const [selectedVeilederIdent, setSelectedVeilederIdent] = useState<
    VeilederIdent | undefined
  >();
  const {
    isLoading: henterVeiledere,
    isError: hentVeilederFeilet,
    data: veiledereFraEnhet,
  } = useVeiledereForValgtEnhetQuery();

  const henterVeilederData = henterAktivVeileder || henterVeiledere;
  const harVeiledere = !!veiledereFraEnhet && !!aktivVeileder;
  const options = harVeiledere
    ? toVeilederOptions(veiledereFraEnhet, aktivVeileder)
    : [];

  const selectedOptions = () => {
    const selectedOption = options.find(
      (option) => option.value === selectedVeilederIdent
    );
    return selectedOption ? [selectedOption] : [];
  };

  const onSelected = (option: VeilederIdent, isSelected: boolean) => {
    if (isSelected) {
      setSelectedVeilederIdent(option);
      setIsError(false);
    } else {
      setSelectedVeilederIdent(undefined);
    }
  };

  function handleTildelVeileder() {
    if (selectedVeilederIdent !== undefined) {
      tildelVeileder.mutate(selectedVeilederIdent, {
        onSuccess: () => handleClose(),
      });
    } else {
      setIsError(true);
    }
  }

  function handleSettSomUfordelt() {
    tildelVeileder.mutate(null, {
      onSuccess: () => handleClose(),
    });
  }

  return (
    <Modal
      className="h-2/3 justify-between"
      header={{ heading: texts.heading }}
      open={open}
      onClose={handleClose}
    >
      <Modal.Body className="flex flex-col gap-8 flex-1">
        {hentVeilederFeilet && (
          <Alert variant="error" size="small">
            {texts.hentVeiledereFailed}
          </Alert>
        )}
        <Alert variant="warning" size="small">
          {texts.alert}
        </Alert>
        <StyledCombobox
          shouldAutocomplete
          isLoading={henterVeilederData}
          label={`${texts.combobox.label} ${valgtEnhet}`}
          description={
            <>
              <BodyShort>{texts.combobox.description1}</BodyShort>
              <BodyShort>{texts.combobox.description2}</BodyShort>
            </>
          }
          selectedOptions={selectedOptions()}
          onToggleSelected={onSelected}
          options={options}
          error={isError && texts.combobox.missingVeileder}
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
          {texts.tildel}
        </Button>
        <Button variant="secondary" onClick={handleClose}>
          {texts.cancel}
        </Button>
        <Button
          type="button"
          variant="tertiary"
          onClick={handleSettSomUfordelt}
        >
          {texts.settSomUfordelt}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
