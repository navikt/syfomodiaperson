import * as React from "react";
import {
  Arbeidsgiver,
  StatusEndring,
  sykepengestoppArsakTekster,
} from "@/data/pengestopp/types/FlaggPerson";
import {
  sykmeldingerToArbeidsgiver,
  uniqueArbeidsgivere,
} from "@/utils/pengestoppUtils";
import { SykmeldingOldFormat } from "@/data/sykmelding/types/SykmeldingOldFormat";
import { texts } from "./Pengestopp";
import { Box, Heading, Label } from "@navikt/ds-react";

interface Props {
  statusEndringList: StatusEndring[];
  sykmeldinger: SykmeldingOldFormat[];
}

const PengestoppHistorikk = ({ statusEndringList, sykmeldinger }: Props) => {
  const allArbeidsgivere = uniqueArbeidsgivere(
    sykmeldingerToArbeidsgiver(sykmeldinger)
  );

  function getArbeidsgiverNavn(
    statusEndring: StatusEndring
  ): string | undefined {
    return (
      allArbeidsgivere.find(
        (ag: Arbeidsgiver) => ag.orgnummer === statusEndring.virksomhetNr?.value
      )?.navn ?? "Ukjent arbeidsgiver"
    );
  }

  function getArsakText(statusEndring: StatusEndring) {
    return `Årsak: ${statusEndring.arsakList
      .map((arsak) => sykepengestoppArsakTekster[arsak.type])
      .join(", ")}.`;
  }

  return (
    <>
      <Heading size="small">{texts.beskjeder}</Heading>
      {statusEndringList.map((statusEndring: StatusEndring, index: number) => {
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
