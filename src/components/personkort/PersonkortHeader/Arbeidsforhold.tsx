import React from "react";
import { BodyShort } from "@navikt/ds-react";
import { useArbeidsforholdQuery } from "@/data/arbeidsforhold/arbeidsforholdQueryHooks";
import {
  ArbeidsforholdDTO,
  getActiveArbeidsforhold,
} from "@/data/arbeidsforhold/ArbeidsforholdDTO";
import { useVirksomhetQuery } from "@/data/virksomhet/virksomhetQueryHooks";

const texts = {
  label: "Arbeidsforhold: ",
  unknown: "ukjent",
  missing: "mangler",
};

interface Props {
  arbeidsforhold: ArbeidsforholdDTO;
  isLast: boolean;
}

function ArbeidsforholdText({ arbeidsforhold, isLast }: Props) {
  const { virksomhetsnavn } = useVirksomhetQuery(arbeidsforhold.orgnummer);

  return (
    <>
      {arbeidsforhold.yrke} i {virksomhetsnavn} (
      {arbeidsforhold.stillingsprosent}&nbsp;%)
      {!isLast && ", "}
    </>
  );
}

export function Arbeidsforhold() {
  const { data, isError, isPending } = useArbeidsforholdQuery();

  if (isPending) {
    return null;
  }

  const aktiveArbeidsforhold = getActiveArbeidsforhold(
    data?.arbeidsforhold ?? []
  );

  let content: React.ReactNode;

  if (aktiveArbeidsforhold.length > 0) {
    content = (
      <>
        {aktiveArbeidsforhold.map((forhold, index) => (
          <ArbeidsforholdText
            key={forhold.navArbeidsforholdId}
            arbeidsforhold={forhold}
            isLast={index === aktiveArbeidsforhold.length - 1}
          />
        ))}
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
