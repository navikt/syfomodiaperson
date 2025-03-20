import * as React from "react";
import {
  Arbeidsgiver,
  Sykepengestopp,
  sykepengestoppArsakTekster,
} from "@/data/pengestopp/types/FlaggPerson";
import {
  sykmeldingerToArbeidsgiver,
  uniqueArbeidsgivere,
} from "@/utils/pengestoppUtils";
import { SykmeldingOldFormat } from "@/data/sykmelding/types/SykmeldingOldFormat";
import { Box, Label } from "@navikt/ds-react";

interface Props {
  statusEndringList: Sykepengestopp[];
  sykmeldinger: SykmeldingOldFormat[];
}

const PengestoppHistorikk = ({ statusEndringList, sykmeldinger }: Props) => {
  const allArbeidsgivere = uniqueArbeidsgivere(
    sykmeldingerToArbeidsgiver(sykmeldinger)
  );

  function getArbeidsgiverNavn(
    statusEndring: Sykepengestopp
  ): string | undefined {
    return (
      allArbeidsgivere.find(
        (ag: Arbeidsgiver) => ag.orgnummer === statusEndring.virksomhetNr?.value
      )?.navn ?? "Ukjent arbeidsgiver"
    );
  }

  function getArsakText(statusEndring: Sykepengestopp) {
    return `Årsak: ${statusEndring.arsakList
      .map((arsak) => sykepengestoppArsakTekster[arsak.type])
      .join(", ")}.`;
  }

  return (
    <>
      {statusEndringList.map((statusEndring: Sykepengestopp, index: number) => {
        const opprettet = new Date(statusEndring.opprettet);
        return (
          <Box
            key={index}
            background="surface-info-subtle"
            borderColor="border-info"
            padding="4"
            borderWidth="1"
            className="my-2"
          >
            <Label size="small">{`${opprettet.getDate()}.${
              opprettet.getMonth() + 1
            }.${opprettet.getFullYear()} · Gjelder for:
            
            ${getArbeidsgiverNavn(statusEndring)}
           `}</Label>
            <p>
              {statusEndring.arsakList?.length > 0 &&
                getArsakText(statusEndring)}
            </p>
          </Box>
        );
      })}
    </>
  );
};

export default PengestoppHistorikk;
