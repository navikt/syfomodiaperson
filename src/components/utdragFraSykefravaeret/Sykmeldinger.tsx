import { useOppfolgingstilfellePersonQuery } from "@/data/oppfolgingstilfelle/person/oppfolgingstilfellePersonQueryHooks";
import { useSykmeldingerQuery } from "@/data/sykmelding/sykmeldingQueryHooks";
import {
  SykmeldingOldFormat,
  SykmeldingStatus,
} from "@/data/sykmelding/types/SykmeldingOldFormat";
import { EventType } from "@/utils/amplitude";
import {
  arbeidsgivernavnEllerArbeidssituasjon,
  erEkstraInformasjonISykmeldingen,
  erSykmeldingUtenArbeidsgiver,
  stringMedAlleGraderingerFraSykmeldingPerioder,
  sykmeldingerInnenforOppfolgingstilfelle,
  sykmeldingerSortertNyestTilEldstPeriode,
  sykmeldingperioderSortertEldstTilNyest,
} from "@/utils/sykmeldinger/sykmeldingUtils";
import { ExpansionCard, Heading, Tag } from "@navikt/ds-react";
import React from "react";
import SykmeldingUtdragFraSykefravaretVisning from "../motebehov/SykmeldingUtdragFraSykefravaretVisning";
import * as Amplitude from "@/utils/amplitude";
import styled from "styled-components";
import { tilLesbarPeriodeMedArstall } from "@/utils/datoUtils";
import { tidligsteFom, senesteTom } from "@/utils/periodeUtils";
import { MerInformasjonImage } from "img/ImageComponents";
import { PapirsykmeldingTag } from "../PapirsykmeldingTag";

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

function logAccordionOpened(isOpen: boolean) {
  if (isOpen) {
    Amplitude.logEvent({
      type: EventType.AccordionOpen,
      data: {
        tekst: `Åpne sykmeldinger accordion`,
        url: window.location.href,
      },
    });
  }
}

const Info = ({ label, text }: { label: string; text: string }) => {
  return (
    <div className="text-base font-normal">
      <b>{label}</b>
      <span>{text}</span>
    </div>
  );
};

interface UtvidbarSykmeldingProps {
  sykmelding: SykmeldingOldFormat;
}

const UtvidbarSykmelding = ({ sykmelding }: UtvidbarSykmeldingProps) => {
  const arbeidsgiverEllerSituasjon =
    arbeidsgivernavnEllerArbeidssituasjon(sykmelding);
  const title = arbeidsgiverEllerSituasjon
    ? arbeidsgiverEllerSituasjon
    : "Sykmelding uten arbeidsgiver";
  return (
    <ExpansionCard aria-label={title} onToggle={logAccordionOpened}>
      <StyledExpantionCardHeader className="w-full">
        <ExpansionCard.Title
          as="div"
          className="flex justify-between m-0 text-base"
        >
          <SykmeldingTittelbeskrivelse sykmelding={sykmelding} />
        </ExpansionCard.Title>
      </StyledExpantionCardHeader>
      <ExpansionCard.Content>
        <SykmeldingUtdragFraSykefravaretVisning sykmelding={sykmelding} />
      </ExpansionCard.Content>
    </ExpansionCard>
  );
};

interface UtvidbarTittelProps {
  sykmelding: SykmeldingOldFormat;
}

const SykmeldingTittelbeskrivelse = ({ sykmelding }: UtvidbarTittelProps) => {
  const sykmeldingPerioderSortertEtterDato =
    sykmeldingperioderSortertEldstTilNyest(
      sykmelding.mulighetForArbeid.perioder
    );

  const periode = `${tilLesbarPeriodeMedArstall(
    tidligsteFom(sykmelding.mulighetForArbeid.perioder),
    senesteTom(sykmelding.mulighetForArbeid.perioder)
  )}: `;
  const graderinger = stringMedAlleGraderingerFraSykmeldingPerioder(
    sykmeldingPerioderSortertEtterDato
  );
  const diagnose = `${sykmelding.diagnose.hoveddiagnose?.diagnosekode} (${sykmelding.diagnose.hoveddiagnose?.diagnose})`;
  const erViktigInformasjon = erEkstraInformasjonISykmeldingen(sykmelding);
  const sykmelder = sykmelding.bekreftelse.sykmelder;
  const arbeidsgiver = arbeidsgivernavnEllerArbeidssituasjon(sykmelding);
  const erIkkeTattIBruk = sykmelding.status === SykmeldingStatus.NY;
  const erUtenArbeidsgiver = erSykmeldingUtenArbeidsgiver(sykmelding);

  return (
    <div className="w-full flex flex-col">
      <div className="flex justify-between mb-2">
        <div>
          {periode}
          {graderinger}
        </div>
        <div className="flex gap-4">
          {erIkkeTattIBruk && (
            <Tag variant="warning" size="small">
              {texts.ny}
            </Tag>
          )}
          {erUtenArbeidsgiver && (
            <Tag variant="info" size="small">
              {texts.utenArbeidsgiver}
            </Tag>
          )}
          {erViktigInformasjon && (
            <img
              height={18}
              alt="Viktig informasjon"
              src={MerInformasjonImage}
            />
          )}
        </div>
      </div>
      {sykmelding.diagnose.hoveddiagnose && (
        <Info label={"Diagnose: "} text={diagnose} />
      )}
      {sykmelder && <Info label={"Sykmelder: "} text={sykmelder} />}
      {arbeidsgiver && <Info label={"Arbeidsgiver: "} text={arbeidsgiver} />}
      {sykmelding.yrkesbetegnelse && (
        <Info
          label={"Stilling fra sykmelding: "}
          text={sykmelding.yrkesbetegnelse}
        />
      )}
      {sykmelding.papirsykmelding && <PapirsykmeldingTag />}
    </div>
  );
};

export default function Sykmeldinger() {
  const { sykmeldinger } = useSykmeldingerQuery();
  const { latestOppfolgingstilfelle } = useOppfolgingstilfellePersonQuery();

  const aktuelleSykmeldinger = sykmeldinger.filter(
    (sykmelding) =>
      sykmelding.status === SykmeldingStatus.SENDT ||
      sykmelding.status === SykmeldingStatus.NY ||
      erSykmeldingUtenArbeidsgiver(sykmelding)
  );
  const sykmeldingerIOppfolgingstilfellet =
    sykmeldingerInnenforOppfolgingstilfelle(
      aktuelleSykmeldinger,
      latestOppfolgingstilfelle
    );
  const sykmeldingerSortertPaaStartDato =
    sykmeldingerSortertNyestTilEldstPeriode(sykmeldingerIOppfolgingstilfellet);

  return (
    <div className="mb-10 [&>*]:mb-2">
      <Heading size="small" level="3">
        {texts.header}
      </Heading>
      {sykmeldingerSortertPaaStartDato.map((sykmelding, index) => (
        <UtvidbarSykmelding sykmelding={sykmelding} key={index} />
      ))}
    </div>
  );
}
