import React from "react";
import {
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
  oppfolgingsenhet: "Kontortilhørighet",
  endret: "Endret",
};

interface Props {
  modalRef: React.RefObject<HTMLDialogElement | null>;
}

//TODO: Rename
export const OppfolgingsenhetInnhold = ({ modalRef }: Props) => {
  const {
    error,
    data: behandlendeenhet,
    isLoading,
    isFetching,
  } = useBehandlendeEnhetQuery();
  const { data: diskresjonskode } = useDiskresjonskodeQuery();
  const { data: isEgenAnsatt } = useEgenansattQuery();

  const apiError = error instanceof ApiErrorException ? error.error : undefined;
  const isKode6 = diskresjonskode === "6";
  const isKode7 = diskresjonskode === "7";
  const kanTildele = !isEgenAnsatt && !isKode6 && !isKode7;

  return (
    <ErrorBoundary apiError={apiError}>
      {isLoading || isFetching ? (
        <AppSpinner />
      ) : (
        behandlendeenhet && (
          <HStack gap={"2"} className={"flex"}>
            <Buildings2Icon fontSize={"1.75rem"} />
            <VStack className={"flex-1"}>
              <HStack align={"center"} className={"mb-2"}>
                <Heading size={"medium"}>{text.header}</Heading>
                <Spacer />
                {behandlendeenhet.createdAt && (
                  <div>
                    {`${text.endret}: ${tilLesbarDatoMedArUtenManedNavn(
                      behandlendeenhet.createdAt
                    )}`}
                  </div>
                )}
              </HStack>
              <HStack align={"end"}>
                <VStack>
                  <BodyShort>
                    {`${behandlendeenhet.oppfolgingsenhet.navn} (${behandlendeenhet.oppfolgingsenhet.enhetId})`}
                  </BodyShort>
                  <BodyShort>
                    {`${text.oppfolgingsenhet}: ${behandlendeenhet.geografiskEnhet.navn} (${behandlendeenhet.geografiskEnhet.enhetId})`}
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
        )
      )}
    </ErrorBoundary>
  );
};
