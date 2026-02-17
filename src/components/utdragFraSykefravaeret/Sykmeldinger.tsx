import { useGetSykmeldingerQuery } from "@/data/sykmelding/useGetSykmeldingerQuery";
import {
  erSykmeldingUtenArbeidsgiver,
  sykmeldingerSortertNyestTilEldstPeriode,
  SykmeldingOldFormat,
  SykmeldingStatus,
} from "@/data/sykmelding/types/SykmeldingOldFormat";
import {
  arbeidsgivernavnEllerArbeidssituasjon,
  sykmeldingerInnenforOppfolgingstilfelle,
} from "@/utils/sykmeldinger/sykmeldingUtils";
import { ExpansionCard, Heading } from "@navikt/ds-react";
import React from "react";
import SykmeldingUtdragFraSykefravaretVisning from "./SykmeldingUtdragFraSykefravaretVisning";
import styled from "styled-components";
import { OppfolgingstilfelleDTO } from "@/data/oppfolgingstilfelle/person/types/OppfolgingstilfellePersonDTO";
import { SykmeldingTittel } from "@/components/utdragFraSykefravaeret/SykmeldingTittel";

const texts = {
  header: "Sykmeldinger",
  utenArbeidsgiver: "Uten arbeidsgiver",
  ny: "Ikke tatt i bruk",
};

const StyledExpantionCardHeader = styled(ExpansionCard.Header)`
  .navds-expansioncard__header-content {
    width: 100%;
  }
`;

interface UtvidbarSykmeldingProps {
  sykmelding: SykmeldingOldFormat;
}

function UtvidbarSykmelding({ sykmelding }: UtvidbarSykmeldingProps) {
  const arbeidsgiverEllerSituasjon =
    arbeidsgivernavnEllerArbeidssituasjon(sykmelding);
  const title = arbeidsgiverEllerSituasjon
    ? arbeidsgiverEllerSituasjon
    : "Sykmelding uten arbeidsgiver";
  return (
    <ExpansionCard aria-label={title}>
      <StyledExpantionCardHeader className="w-full">
        <ExpansionCard.Title
          as="div"
          className="flex justify-between m-0 text-base"
        >
          <SykmeldingTittel sykmelding={sykmelding} />
        </ExpansionCard.Title>
      </StyledExpantionCardHeader>
      <ExpansionCard.Content className={"print:block"}>
        <SykmeldingUtdragFraSykefravaretVisning sykmelding={sykmelding} />
      </ExpansionCard.Content>
    </ExpansionCard>
  );
}

interface Props {
  selectedOppfolgingstilfelle: OppfolgingstilfelleDTO | undefined;
}

export default function Sykmeldinger({ selectedOppfolgingstilfelle }: Props) {
  const { sykmeldinger } = useGetSykmeldingerQuery();

  const aktuelleSykmeldinger = sykmeldinger.filter(
    (sykmelding) =>
      sykmelding.status === SykmeldingStatus.SENDT ||
      sykmelding.status === SykmeldingStatus.NY ||
      erSykmeldingUtenArbeidsgiver(sykmelding)
  );
  const sykmeldingerIOppfolgingstilfellet =
    sykmeldingerInnenforOppfolgingstilfelle(
      aktuelleSykmeldinger,
      selectedOppfolgingstilfelle
    );
  const sykmeldingerSortertPaaStartDato =
    sykmeldingerSortertNyestTilEldstPeriode(sykmeldingerIOppfolgingstilfellet);

  return (
    <div className="[&>*]:mb-2">
      <Heading size="small" level="3">
        {texts.header}
      </Heading>
      {sykmeldingerSortertPaaStartDato.map((sykmelding, index) => (
        <UtvidbarSykmelding sykmelding={sykmelding} key={index} />
      ))}
    </div>
  );
}
