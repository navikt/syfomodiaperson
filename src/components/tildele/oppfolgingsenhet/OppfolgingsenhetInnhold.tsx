import React from "react";
import {
  Alert,
  BodyShort,
  Button,
  Heading,
  HStack,
  Spacer,
  VStack,
} from "@navikt/ds-react";
import { Buildings2Icon } from "@navikt/aksel-icons";
import { tilLesbarDatoMedArUtenManedNavn } from "@/utils/datoUtils";
import { useBehandlendeEnhetQuery } from "@/data/behandlendeenhet/behandlendeEnhetQueryHooks";
import AppSpinner from "@/components/AppSpinner";
import { ApiErrorException } from "@/api/errors";
import ErrorBoundary from "@/components/ErrorBoundary";
import { useDiskresjonskodeQuery } from "@/data/diskresjonskode/diskresjonskodeQueryHooks";
import { useEgenansattQuery } from "@/data/egenansatt/egenansattQueryHooks";

const text = {
  header: "Oppfølgingsenhet",
  buttonLabelEndreOppfolgingsenhet: "Endre",
  kontortilhorighet: "Kontortilhørighet",
  endret: "Endret",
  errorIngenInfoOmBehandlendeEnhet: "Henting av kontortilhørighet feilet",
};

interface Props {
  modalRef: React.RefObject<HTMLDialogElement | null>;
}

const kanTildeleOppfolgingsenhet = (
  isEgenAnsatt: boolean | undefined,
  diskresjonskode: string | undefined
) => {
  const isKode6 = diskresjonskode === "6";
  const isKode7 = diskresjonskode === "7";
  return !isEgenAnsatt && !isKode6 && !isKode7;
};

export const OppfolgingsenhetInnhold = ({ modalRef }: Props) => {
  const {
    error,
    data: behandlendeenhet,
    isPending,
    isFetching,
    isError,
  } = useBehandlendeEnhetQuery();
  const { data: diskresjonskode } = useDiskresjonskodeQuery();
  const { data: isEgenAnsatt } = useEgenansattQuery();

  if (isPending || isFetching) {
    return <AppSpinner />;
  }

  if (isError) {
    const apiError =
      error instanceof ApiErrorException ? error.error : undefined;
    return <ErrorBoundary apiError={apiError} />;
  }

  if (!behandlendeenhet) {
    return (
      <Alert variant={"error"}>{text.errorIngenInfoOmBehandlendeEnhet}</Alert>
    );
  }

  const oppfolgingsenhet = behandlendeenhet?.oppfolgingsenhetDTO
    ? behandlendeenhet.oppfolgingsenhetDTO.enhet
    : behandlendeenhet.geografiskEnhet;
  const kanTildele = kanTildeleOppfolgingsenhet(isEgenAnsatt, diskresjonskode);

  return (
    <HStack gap={"2"} className={"flex"}>
      <Buildings2Icon fontSize={"1.75rem"} />
      <VStack className={"flex-1"}>
        <HStack align={"center"} className={"mb-2"}>
          <Heading size={"medium"}>{text.header}</Heading>
          <Spacer />
          {behandlendeenhet?.oppfolgingsenhetDTO && (
            <div>
              {`${text.endret}: ${tilLesbarDatoMedArUtenManedNavn(
                behandlendeenhet.oppfolgingsenhetDTO.createdAt
              )}`}
            </div>
          )}
        </HStack>
        <HStack align={"end"}>
          <VStack>
            <BodyShort>
              {`${oppfolgingsenhet.navn} (${oppfolgingsenhet.enhetId})`}
            </BodyShort>
            <BodyShort>
              {`${text.kontortilhorighet}: ${behandlendeenhet.geografiskEnhet.navn} (${behandlendeenhet.geografiskEnhet.enhetId})`}
            </BodyShort>
          </VStack>
          <Spacer />
          {kanTildele && (
            <Button
              variant="secondary"
              size="small"
              onClick={() => modalRef.current?.showModal()}
            >
              {text.buttonLabelEndreOppfolgingsenhet}
            </Button>
          )}
        </HStack>
      </VStack>
    </HStack>
  );
};
