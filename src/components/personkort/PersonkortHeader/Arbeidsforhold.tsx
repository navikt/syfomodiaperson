import React from "react";
import { BodyShort } from "@navikt/ds-react";
import { useArbeidsforholdQuery } from "@/data/arbeidsforhold/arbeidsforholdQueryHooks";
import {
  ArbeidsforholdDTO,
  getActiveArbeidsforhold,
} from "@/data/arbeidsforhold/ArbeidsforholdDTO";
import { useVirksomhetQuery } from "@/data/virksomhet/virksomhetQueryHooks";
import { capitalizeAllWords } from "@/utils/stringUtils.ts";

const texts = {
  label: "Arbeidsforhold: ",
  unknown: "ukjent",
  missing: "mangler",
  moreInAareg: (maxCount: number) =>
    ` — ${MAX_VISIBLE_ARBEIDSFORHOLD} av ${maxCount}, flere i AA register`,
};

const MAX_VISIBLE_ARBEIDSFORHOLD = 2;

interface Props {
  arbeidsforhold: ArbeidsforholdDTO;
  isLast: boolean;
}

function ArbeidsforholdText({ arbeidsforhold, isLast }: Props) {
  const { virksomhetsnavn } = useVirksomhetQuery(arbeidsforhold.orgnummer);

  return (
    <>
      {capitalizeAllWords(arbeidsforhold.yrke)} i {virksomhetsnavn} (
      {arbeidsforhold.stillingsprosent}&nbsp;%)
      {!isLast && " — "}
    </>
  );
}

export function Arbeidsforhold() {
  const { data, isError, isPending } = useArbeidsforholdQuery();

  if (isPending) {
    return null;
  }

  const aktiveArbeidsforholdSortertEtterHoyestStillingsprosent =
    getActiveArbeidsforhold(data?.arbeidsforhold ?? []).sort(
      (a, b) => parseFloat(b.stillingsprosent) - parseFloat(a.stillingsprosent)
    );
  const visibleArbeidsforhold =
    aktiveArbeidsforholdSortertEtterHoyestStillingsprosent.slice(
      0,
      MAX_VISIBLE_ARBEIDSFORHOLD
    );
  const antallFlereArbeidsforhold =
    aktiveArbeidsforholdSortertEtterHoyestStillingsprosent.length;

  let content: React.ReactNode;

  if (aktiveArbeidsforholdSortertEtterHoyestStillingsprosent.length > 0) {
    content = (
      <>
        {visibleArbeidsforhold.map((forhold, index) => (
          <ArbeidsforholdText
            key={forhold.navArbeidsforholdId}
            arbeidsforhold={forhold}
            isLast={index === visibleArbeidsforhold.length - 1}
          />
        ))}
        {antallFlereArbeidsforhold > 0 &&
          texts.moreInAareg(antallFlereArbeidsforhold)}
      </>
    );
  } else if (isError) {
    content = texts.unknown;
  } else {
    content = texts.missing;
  }

  return (
    <>
      <BodyShort as="span" size="small">
        {texts.label}
      </BodyShort>
      <BodyShort as="span" size="small" weight="semibold">
        {content}
      </BodyShort>
    </>
  );
}
