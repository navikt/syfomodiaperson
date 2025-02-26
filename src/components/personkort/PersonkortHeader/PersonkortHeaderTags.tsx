import React from "react";
import ErrorBoundary from "@/components/ErrorBoundary";
import { ApiErrorException } from "@/api/errors";
import { Tag } from "@navikt/ds-react";
import { useEgenansattQuery } from "@/data/egenansatt/egenansattQueryHooks";
import { useNavBrukerData } from "@/data/navbruker/navbruker_hooks";
import { useDiskresjonskodeQuery } from "@/data/diskresjonskode/diskresjonskodeQueryHooks";
import { tilLesbarDatoMedArUtenManedNavn } from "@/utils/datoUtils";
import { useUnderArbeidsrettetOppfolgingQuery } from "@/data/veilarboppfolging/useUnderArbeidsrettetOppfolgingQuery";
import { useVedtakQuery } from "@/data/frisktilarbeid/vedtakQuery";
import { useUforegradQuery } from "@/data/uforegrad/uforegradQueryHooks";

const texts = {
  fetchDiskresjonskodeFailed: "Klarte ikke hente diskresjonskode for brukeren.",
  dod: "Død",
  kode6: "Kode 6",
  kode7: "Kode 7",
  egenansatt: "Egenansatt",
  talesprakTolk: "Talespråktolk",
  tegnsprakTolk: "Tegnspråktolk",
  sikkerhetstiltak: "Sikkerhetstiltak",
  ao: "Under arbeidsrettet oppfølging",
  friskmeldingTilArbeidsformidling: "Har vedtak om § 8-5",
};

export const PersonkortHeaderTags = () => {
  const { data: isEgenAnsatt } = useEgenansattQuery();
  const { dodsdato, hasSikkerhetstiltak, tilrettelagtKommunikasjon } =
    useNavBrukerData();
  const { error, data: diskresjonskode } = useDiskresjonskodeQuery();
  const { data: arbeidsrettetOppfolging } =
    useUnderArbeidsrettetOppfolgingQuery();
  const { data: vedtakFriskTilArbeid } = useVedtakQuery();
  const { data: uforegradData } = useUforegradQuery();

  const isDead = !!dodsdato;
  const dateOfDeath = tilLesbarDatoMedArUtenManedNavn(dodsdato);
  const isKode6 = diskresjonskode === "6";
  const isKode7 = diskresjonskode === "7";
  const talesprakTolkSprakkode =
    tilrettelagtKommunikasjon?.talesprakTolk?.value;
  const tegnsprakTolkSprakkode =
    tilrettelagtKommunikasjon?.tegnsprakTolk?.value;
  const hasActiveFriskmeldingVedtak =
    vedtakFriskTilArbeid[0] &&
    new Date(vedtakFriskTilArbeid[0].tom).getTime() >= new Date().getTime();

  return (
    <ErrorBoundary
      apiError={error instanceof ApiErrorException ? error.error : undefined}
      errorMessage={texts.fetchDiskresjonskodeFailed}
    >
      <div className="flex flex-1 gap-2 h-fit flex-wrap justify-end mr-4">
        {isKode6 && (
          <Tag variant="warning" size="small">
            {texts.kode6}
          </Tag>
        )}
        {isKode7 && (
          <Tag variant="warning" size="small">
            {texts.kode7}
          </Tag>
        )}
        {isEgenAnsatt && (
          <Tag variant="warning" size="small">
            {texts.egenansatt}
          </Tag>
        )}
        {arbeidsrettetOppfolging?.underOppfolging && (
          <Tag variant="warning" size="small">
            {texts.ao}
          </Tag>
        )}
        {hasActiveFriskmeldingVedtak && (
          <Tag variant="info" size="small">
            {texts.friskmeldingTilArbeidsformidling}
          </Tag>
        )}
        {uforegradData?.uforegrad && (
          <Tag variant="info" size="small">
            {`Ufør ${uforegradData.uforegrad}%`}
          </Tag>
        )}
        {talesprakTolkSprakkode && (
          <Tag variant="warning" size="small">
            {texts.talesprakTolk}: {talesprakTolkSprakkode}
          </Tag>
        )}
        {tegnsprakTolkSprakkode && (
          <Tag variant="warning" size="small">
            {texts.tegnsprakTolk}: {tegnsprakTolkSprakkode}
          </Tag>
        )}
        {isDead && (
          <Tag
            variant="error"
            size="small"
          >{`${texts.dod} ${dateOfDeath}`}</Tag>
        )}
        {hasSikkerhetstiltak && (
          <Tag variant="error" size="small">
            {texts.sikkerhetstiltak}
          </Tag>
        )}
      </div>
    </ErrorBoundary>
  );
};
