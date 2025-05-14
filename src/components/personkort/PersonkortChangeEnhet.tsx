import React, { useState } from "react";
import { BodyLong, Button, Heading, Modal } from "@navikt/ds-react";
import styled from "styled-components";
import { useChangeEnhet } from "@/components/personkort/useChangeEnhet";
import { useValgtPersonident } from "@/hooks/useValgtBruker";
import {
  BehandlendeEnhetResponseDTO,
  TildelOppfolgingsenhetRequestDTO,
} from "@/data/behandlendeenhet/types/BehandlendeEnhetDTOs";
import { SkjemaInnsendingFeil } from "@/components/SkjemaInnsendingFeil";

const texts = {
  endre: "Endre til",
  toUtland: {
    contentModal1:
      "Hvis du ikke har tilgang til Nav utland, vil du miste tilgangen til denne personen når enheten endres.",
    contentModal2:
      "Veiledere med tilgang til Nav utland kan senere flytte personen tilbake til geografisk enhet.",
  },
  toGeografisk: {
    contentModal1:
      "Hvis du ikke har tilgang til den geografiske enheten, vil du miste tilgangen til denne personen når enheten endres.",
    contentModal2:
      "Veiledere med tilgang til geografisk enhet kan senere flytte personen tilbake til Nav Utland.",
  },
};

const NAV_UTLAND = "0393";

const ButtonGroup = styled.div`
  > * {
    margin-right: 1em;
  }
`;

interface PersonkortChangeEnhetProps {
  behandlendeEnhet: BehandlendeEnhetResponseDTO;
}

const PersonkortChangeEnhet = ({
  behandlendeEnhet,
}: PersonkortChangeEnhetProps) => {
  const [open, setOpen] = useState(false);
  const fnr = useValgtPersonident();
  const changeEnhet = useChangeEnhet(fnr);

  const isCurrentlyNavUtland =
    (behandlendeEnhet.oppfolgingsenhetDTO?.enhet?.enhetId ??
      behandlendeEnhet.geografiskEnhet?.enhetId) === NAV_UTLAND;
  const heading = `${texts.endre} ${
    isCurrentlyNavUtland
      ? `geografisk enhet (${behandlendeEnhet.geografiskEnhet.enhetId})`
      : "Nav utland"
  }`;

  const modalText1 = isCurrentlyNavUtland
    ? texts.toGeografisk.contentModal1
    : texts.toUtland.contentModal1;
  const modalText2 = isCurrentlyNavUtland
    ? texts.toGeografisk.contentModal2
    : texts.toUtland.contentModal2;

  const updateEnhet = () => {
    const newEnhet = isCurrentlyNavUtland
      ? behandlendeEnhet.geografiskEnhet.enhetId
      : NAV_UTLAND;
    const requestDTO: TildelOppfolgingsenhetRequestDTO = {
      personidenter: [fnr],
      oppfolgingsenhet: newEnhet,
    };
    changeEnhet.mutate(requestDTO, {
      onSuccess: () => setOpen(false),
    });
  };

  return (
    <>
      <Button variant="secondary" onClick={() => setOpen(true)}>
        {heading}
      </Button>
      <Modal
        closeOnBackdropClick
        className="max-w-2xl"
        open={open}
        aria-label="Modal endre enhet"
        onClose={() => setOpen(false)}
      >
        <Modal.Header>
          <Heading spacing level="1" size="large" id="modal-heading">
            {heading}
          </Heading>
        </Modal.Header>
        <Modal.Body>
          <BodyLong as={"div"} spacing={true}>
            <p>{modalText1}</p>
            <p>{modalText2}</p>
          </BodyLong>
          {changeEnhet.isError && (
            <SkjemaInnsendingFeil error={changeEnhet.error} />
          )}
        </Modal.Body>
        <Modal.Footer>
          <ButtonGroup>
            <Button
              variant="danger"
              onClick={updateEnhet}
              loading={changeEnhet.isPending}
            >
              {heading}
            </Button>
            <Button variant="tertiary" onClick={() => setOpen(false)}>
              Avbryt
            </Button>
          </ButtonGroup>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default PersonkortChangeEnhet;
