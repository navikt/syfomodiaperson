import React from "react";
import ErrorBoundary from "@/components/ErrorBoundary";
import { ApiErrorException } from "@/api/errors";
import { FlexGapSize, FlexRow } from "@/components/Layout";
import { Tag } from "@navikt/ds-react";
import { useEgenansattQuery } from "@/data/egenansatt/egenansattQueryHooks";
import { useNavBrukerData } from "@/data/navbruker/navbruker_hooks";
import { useDiskresjonskodeQuery } from "@/data/diskresjonskode/diskresjonskodeQueryHooks";
import { tilLesbarDatoMedArUtenManedNavn } from "@/utils/datoUtils";
import { TildeltVeileder } from "@/components/personkort/PersonkortHeader/TildeltVeileder";
import { useUnderArbeidsrettetOppfolgingQuery } from "@/data/veilarboppfolging/useUnderArbeidsrettetOppfolgingQuery";

const texts = {
  fetchDiskresjonskodeFailed: "Klarte ikke hente diskresjonskode for brukeren.",
  dod: "Død",
  kode6: "Kode 6",
  kode7: "Kode 7",
  egenansatt: "Egenansatt",
  talesprakTolk: "Talespråktolk",
  tegnsprakTolk: "Tegnspråktolk",
  sikkerhetstiltak: "Sikkerhetstiltak",
};

export const PersonkortHeaderTags = () => {
  const { data: isEgenAnsatt } = useEgenansattQuery();
  const { dodsdato, hasSikkerhetstiltak, tilrettelagtKommunikasjon } =
    useNavBrukerData();
  const { error, data: diskresjonskode } = useDiskresjonskodeQuery();
  const { data: arbeidsrettetOppfolging } =
    useUnderArbeidsrettetOppfolgingQuery();

  const isDead = !!dodsdato;
  const dateOfDeath = tilLesbarDatoMedArUtenManedNavn(dodsdato);
  const isKode6 = diskresjonskode === "6";
  const isKode7 = diskresjonskode === "7";
  const talesprakTolkSprakkode =
    tilrettelagtKommunikasjon?.talesprakTolk?.value;
  const tegnsprakTolkSprakkode =
    tilrettelagtKommunikasjon?.tegnsprakTolk?.value;

  return (
    <ErrorBoundary
      apiError={error instanceof ApiErrorException ? error.error : undefined}
      errorMessage={texts.fetchDiskresjonskodeFailed}
    >
      <FlexRow columnGap={FlexGapSize.SM}>
        <TildeltVeileder />
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
        <Tag variant="warning" size="small">
          {arbeidsrettetOppfolging?.underOppfolging
            ? "Er under arbeidsrettet oppfølging"
            : "Er ikke under arbeidsrettet oppfølging"}
        </Tag>
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
      </FlexRow>
    </ErrorBoundary>
  );
};
