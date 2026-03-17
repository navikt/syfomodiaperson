import React from "react";
import { tilLesbarDatoMedArstall } from "@/utils/datoUtils";
import dayjs from "dayjs";
import { BodyLong, Heading } from "@navikt/ds-react";

const texts = {
  title: "Egenmeldingsdager",
  daySingle: "dag",
  dayMultiple: "dager",
};

interface Props {
  egenmeldingsdager: string[];
}

export function Egenmeldingsdager({ egenmeldingsdager }: Props) {
  const antallDager = egenmeldingsdager.length;
  const dayText = antallDager === 1 ? texts.daySingle : texts.dayMultiple;

  const asDateAscending = (dateA: string, dateB: string) =>
    dayjs(dateA).isAfter(dayjs(dateB)) ? 1 : -1;

  return (
    <div className="mb-5">
      <Heading size="xsmall" level="3" className="mb-1">
        {texts.title}
      </Heading>
      {egenmeldingsdager.sort(asDateAscending).map((dag, index) => (
        <BodyLong size="small" key={index} className="mb-1">
          {tilLesbarDatoMedArstall(dag)}
        </BodyLong>
      ))}
      <BodyLong size="small">{`(${antallDager} ${dayText})`}</BodyLong>
    </div>
  );
}
