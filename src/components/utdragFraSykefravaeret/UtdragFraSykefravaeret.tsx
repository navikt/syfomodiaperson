import React from "react";
import SykmeldingMotebehovVisning from "../motebehov/SykmeldingMotebehovVisning";
import {
  arbeidsgivernavnEllerArbeidssituasjon,
  erEkstraInformasjonISykmeldingen,
  stringMedAlleGraderingerFraSykmeldingPerioder,
  sykmeldingerGruppertEtterVirksomhet,
  sykmeldingerInnenforOppfolgingstilfelle,
  sykmeldingerMedStatusSendt,
  sykmeldingerSortertNyestTilEldst,
  sykmeldingerUtenArbeidsgiver,
  sykmeldingperioderSortertEldstTilNyest,
} from "@/utils/sykmeldinger/sykmeldingUtils";
import { finnMiljoStreng } from "@/utils/miljoUtil";
import { tilLesbarPeriodeMedArstall } from "@/utils/datoUtils";
import { senesteTom, tidligsteFom } from "@/utils/periodeUtils";
import styled from "styled-components";
import { SykmeldingOldFormat } from "@/data/sykmelding/types/SykmeldingOldFormat";
import {
  GultDokumentImage,
  MerInformasjonImage,
} from "../../../img/ImageComponents";
import { UtdragOppfolgingsplaner } from "./UtdragOppfolgingsplaner";
import { SpinnsynLenke } from "@/components/vedtak/SpinnsynLenke";
import { OppfolgingstilfelleDTO } from "@/data/oppfolgingstilfelle/person/types/OppfolgingstilfellePersonDTO";
import { useOppfolgingstilfellePersonQuery } from "@/data/oppfolgingstilfelle/person/oppfolgingstilfellePersonQueryHooks";
import { useSykmeldingerQuery } from "@/data/sykmelding/sykmeldingQueryHooks";
import { useValgtPersonident } from "@/hooks/useValgtBruker";
import { IconHeader } from "@/components/IconHeader";
import { PapirsykmeldingTag } from "@/components/PapirsykmeldingTag";
import { ExpansionCard, Heading, Link, Panel } from "@navikt/ds-react";

const tekster = {
  header: "Utdrag fra sykefraværet",
  sykmeldinger: {
    header: "Sykmeldinger",
    headerUtenArbeidsgiver: "Sykmeldinger uten arbeidsgiver",
  },
  samtalereferat: {
    header: "Samtalereferat",
    lenkeTekst: "Samtalereferat",
  },
  vedtak: {
    header: "Vedtak",
  },
  apneSykmelding: "Åpne sykmelding",
};

const StyledExpantionCardHeader = styled(ExpansionCard.Header)`
  .navds-expansioncard__header-content {
    width: 100%;
  }
`;

interface UtvidbarTittelProps {
  sykmelding: SykmeldingOldFormat;
}

export const SykmeldingTittelbeskrivelse = ({
  sykmelding,
}: UtvidbarTittelProps) => {
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

  return (
    <div className="w-full flex flex-col gap-1">
      <div className="flex justify-between">
        <div>
          {periode}
          {graderinger}
        </div>
      </div>
      {sykmelding.diagnose.hoveddiagnose && (
        <div className="text-gray-500">{diagnose}</div>
      )}
      {sykmelding.papirsykmelding && <PapirsykmeldingTag />}
    </div>
  );
};

interface UtvidbarSykmeldingProps {
  sykmelding: SykmeldingOldFormat;
  label?: string;
}

const UtvidbarSykmelding = ({ sykmelding, label }: UtvidbarSykmeldingProps) => {
  const title = label ? label : "Sykmelding uten arbeidsgiver";
  const erViktigInformasjon = erEkstraInformasjonISykmeldingen(sykmelding);
  return (
    <ExpansionCard aria-label={title}>
      <StyledExpantionCardHeader className="w-full">
        <ExpansionCard.Title as="div" className="flex justify-between">
          <Heading as="h4" size="xsmall">
            {title}
          </Heading>
          {erViktigInformasjon && <img alt="Mer" src={MerInformasjonImage} />}
        </ExpansionCard.Title>
        <ExpansionCard.Description className="w-full text-base">
          <SykmeldingTittelbeskrivelse sykmelding={sykmelding} />
        </ExpansionCard.Description>
      </StyledExpantionCardHeader>
      <ExpansionCard.Content>
        <SykmeldingMotebehovVisning sykmelding={sykmelding} />
      </ExpansionCard.Content>
    </ExpansionCard>
  );
};

interface SykmeldingerForVirksomhetProps {
  latestOppfolgingstilfelle?: OppfolgingstilfelleDTO;
  sykmeldinger: SykmeldingOldFormat[];
}

export const SykmeldingerForVirksomhet = ({
  latestOppfolgingstilfelle,
  sykmeldinger,
}: SykmeldingerForVirksomhetProps) => {
  const innsendteSykmeldinger = sykmeldingerMedStatusSendt(sykmeldinger);
  const sykmeldingerIOppfolgingstilfellet =
    sykmeldingerInnenforOppfolgingstilfelle(
      innsendteSykmeldinger,
      latestOppfolgingstilfelle
    );
  const sykmeldingerSortertPaaUtstedelsesdato =
    sykmeldingerSortertNyestTilEldst(sykmeldingerIOppfolgingstilfellet);
  const sykmeldingerSortertPaaVirksomhet = sykmeldingerGruppertEtterVirksomhet(
    sykmeldingerSortertPaaUtstedelsesdato
  );

  return (
    <div className="mb-10 [&>*]:mb-4">
      <Heading size="small" level="3">
        {tekster.sykmeldinger.header}
      </Heading>
      {Object.keys(sykmeldingerSortertPaaVirksomhet).map((key) => {
        return sykmeldingerSortertPaaVirksomhet[key].map(
          (sykmelding, index) => {
            const arbeidsgiverEllerSituasjon =
              arbeidsgivernavnEllerArbeidssituasjon(sykmelding);
            return (
              <UtvidbarSykmelding
                sykmelding={sykmelding}
                label={arbeidsgiverEllerSituasjon}
                key={index}
              />
            );
          }
        );
      })}
    </div>
  );
};

interface SykmeldingerUtenArbeidsgiverProps {
  sykmeldingerSortertPaUtstedelsesdato: SykmeldingOldFormat[];
}

export const SykmeldingerUtenArbeidsgiver = ({
  sykmeldingerSortertPaUtstedelsesdato,
}: SykmeldingerUtenArbeidsgiverProps) => {
  return (
    <div className="mb-10 [&>*]:mb-2">
      <Heading size="small" level="3">
        {tekster.sykmeldinger.headerUtenArbeidsgiver}
      </Heading>
      {sykmeldingerSortertPaUtstedelsesdato.map((sykmelding, index) => {
        return <UtvidbarSykmelding sykmelding={sykmelding} key={index} />;
      })}
    </div>
  );
};

const SamtalereferatWrapper = styled.div`
  margin-bottom: 2em;
`;

export const Samtalereferat = () => {
  const fnr = useValgtPersonident();
  return (
    <SamtalereferatWrapper>
      <Heading size="small" level="3">
        {tekster.samtalereferat.header}
      </Heading>
      <Link
        href={`https://modapp${finnMiljoStreng()}.adeo.no/modiabrukerdialog/person/${fnr}#!meldinger`}
        target="_blank"
      >
        {tekster.samtalereferat.lenkeTekst}
      </Link>
    </SamtalereferatWrapper>
  );
};

const UtdragFraSykefravaeret = () => {
  const { sykmeldinger } = useSykmeldingerQuery();
  const { latestOppfolgingstilfelle } = useOppfolgingstilfellePersonQuery();

  const innsendteSykmeldingerUtenArbeidsgiver =
    sykmeldingerUtenArbeidsgiver(sykmeldinger);
  const sykmeldingerIOppfolgingstilfellet =
    sykmeldingerInnenforOppfolgingstilfelle(
      innsendteSykmeldingerUtenArbeidsgiver,
      latestOppfolgingstilfelle
    );
  const sykmeldingerSortertPaUtstedelsesdato = sykmeldingerSortertNyestTilEldst(
    sykmeldingerIOppfolgingstilfellet
  );

  return (
    <Panel className="mb-4">
      <IconHeader
        icon={GultDokumentImage}
        altIcon="Gult dokument"
        header={tekster.header}
      />
      <UtdragOppfolgingsplaner />

      <SykmeldingerForVirksomhet
        latestOppfolgingstilfelle={latestOppfolgingstilfelle}
        sykmeldinger={sykmeldinger}
      />

      {sykmeldingerSortertPaUtstedelsesdato?.length > 0 && (
        <SykmeldingerUtenArbeidsgiver
          sykmeldingerSortertPaUtstedelsesdato={
            sykmeldingerSortertPaUtstedelsesdato
          }
        />
      )}

      <Samtalereferat />
      <Heading size="small" level="3">
        {tekster.vedtak.header}
      </Heading>
      <SpinnsynLenke />
    </Panel>
  );
};

export default UtdragFraSykefravaeret;
