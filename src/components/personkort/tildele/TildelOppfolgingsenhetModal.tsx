import {
  Alert,
  BodyLong,
  Button,
  Modal,
  Skeleton,
  UNSAFE_Combobox,
} from "@navikt/ds-react";
import React, { useState } from "react";
import {
  Notification,
  useNotification,
} from "@/context/notification/NotificationContext";
import {
  Enhet,
  useGetMuligeOppfolgingsenheter,
} from "@/components/personkort/tildele/useGetMuligeOppfolgingsenheter";
import { useChangeEnhet } from "@/components/personkort/useChangeEnhet";
import { useValgtPersonident } from "@/hooks/useValgtBruker";
import { useBrukerinfoQuery } from "@/data/navbruker/navbrukerQueryHooks";
import { useVirksomhetQuery } from "@/data/virksomhet/virksomhetQueryHooks";
import { useVirksomhetsnummerOfLatestOppfolgingstilfelle } from "@/data/oppfolgingstilfelle/person/oppfolgingstilfellePersonQueryHooks";

const text = {
  heading: "Endre oppfølgingsenhet",
  description:
    "Her kan du flytte den sykmeldte til en annen oppfølgingsenhet. Dersom den sykemeldte har endret bostedsadresse, skjer flyttingen automatisk.",
  velgOppfolgingsenhet: "Velg ny oppfølgingsenhet",
  formErrorMessage: "Du må velge en oppfølgingsenhet",
  getMuligeOppfolgingsenheterFailedErrorMessage:
    "Noe gikk galt. Klarer ikke å hente mulig enheter å tildele til.",
  endreEnhet: "Endre oppfølgingsenhet",
  avbryt: "Avbryt",
};

interface Props {
  ref: React.RefObject<HTMLDialogElement | null>;
}

const tildelOppfolgingsenhetFailed: Notification = {
  type: "tildelOppfolgingsenhetFailed",
  variant: "error",
  message: "Tildeling av oppfølgingsenhet feilet.",
};

const tildelOppfolgingsenhetSuccess = (
  navn: string,
  enhet: string
): Notification => {
  return {
    type: "tildelOppfolgingsenhetSuccess",
    variant: "success",
    header: "Bruker flyttet",
    message: `${navn} tildelt ${enhet}.`,
    isGlobal: true,
  };
};

export default function TildelOppfolgingsenhetModal({ ref }: Props) {
  const getMuligeOppfolgingsenheter = useGetMuligeOppfolgingsenheter();
  const fnr = useValgtPersonident();
  const changeEnhet = useChangeEnhet(fnr);
  const [oppfolgingsenhet, setOppfolgingsenhet] = useState<string>("");
  const [isFormError, setIsFormError] = useState<boolean>(false);
  const { setNotification: displayNotification } = useNotification();
  const {
    brukerinfo: { navn },
  } = useBrukerinfoQuery();
  const virksomhetsnummer = useVirksomhetsnummerOfLatestOppfolgingstilfelle();
  const virksomhet = useVirksomhetQuery(virksomhetsnummer);

  function closeModal() {
    ref.current?.close();
  }

  function onOppfolgingsenhetChange(option: string, isSelected: boolean) {
    if (isSelected) {
      setIsFormError(false);
      setOppfolgingsenhet(option);
    } else {
      setIsFormError(true);
      setOppfolgingsenhet("");
    }
  }

  const findEnhetById = (enheter: Enhet[]): Enhet | undefined =>
    enheter.find((enhet) => enhet.enhetId === oppfolgingsenhet);

  function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    const isFormValid = oppfolgingsenhet !== "";
    if (!isFormValid) {
      setIsFormError(true);
    } else {
      changeEnhet.mutate(
        {
          personidenter: [fnr],
          oppfolgingsenhet: oppfolgingsenhet,
        },
        {
          onSuccess: () => {
            const tildeltOppfolgingsenhet =
              getMuligeOppfolgingsenheter.data?.find(
                (enhet) => enhet.enhetId === oppfolgingsenhet
              );
            displayNotification(
              tildelOppfolgingsenhetSuccess(
                navn,
                `${tildeltOppfolgingsenhet?.navn} (${tildeltOppfolgingsenhet?.enhetId})`
              )
            );
          },
          onError: () => displayNotification(tildelOppfolgingsenhetFailed),
        }
      );
      ref.current?.close();
    }
  }

  const nyEnhet = findEnhetById(getMuligeOppfolgingsenheter.data ?? []);

  return (
    <Modal ref={ref} header={{ heading: text.heading }}>
      <Modal.Body className="flex flex-col gap-4">
        {getMuligeOppfolgingsenheter.isLoading && (
          <>
            <Skeleton variant="rectangle" width="100%" height={300} />
            <Skeleton variant="rectangle" width="100%" height={300} />
          </>
        )}
        {getMuligeOppfolgingsenheter.isSuccess && (
          <>
            <BodyLong>{text.description}</BodyLong>
            <form id="form" onSubmit={onSubmit}>
              <UNSAFE_Combobox
                label={text.velgOppfolgingsenhet}
                size="small"
                options={getMuligeOppfolgingsenheter.data.map((enhet) => ({
                  label: `${enhet.navn} (${enhet.enhetId})`,
                  value: enhet.enhetId,
                }))}
                onToggleSelected={onOppfolgingsenhetChange}
                className="flex flex-col fixed min-w-[20rem]"
                error={isFormError && text.formErrorMessage}
              />
              {/* Filler element for fixed combobox */}
              <div className="h-[3.75rem]"></div>
            </form>
            {oppfolgingsenhet && nyEnhet && (
              <BodyLong>{`Du tildeler nå ${navn} (${fnr}) ${
                virksomhet.virksomhetsnavn
                  ? ` ved ${virksomhet.virksomhetsnavn}`
                  : " uten virksomhet"
              } til ${nyEnhet.navn} (${nyEnhet.enhetId}).`}</BodyLong>
            )}
          </>
        )}
        {getMuligeOppfolgingsenheter.isError && (
          <Alert size="small" variant="error">
            {text.getMuligeOppfolgingsenheterFailedErrorMessage}
          </Alert>
        )}
      </Modal.Body>
      <Modal.Footer>
        {getMuligeOppfolgingsenheter.isSuccess && (
          <Button form="form" loading={changeEnhet.isPending}>
            {text.endreEnhet}
          </Button>
        )}
        <Button type="button" variant="secondary" onClick={closeModal}>
          {text.avbryt}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
