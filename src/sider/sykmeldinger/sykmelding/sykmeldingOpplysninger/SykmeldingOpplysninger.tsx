import React from "react";
import {
  SykmeldingDiagnose,
  SykmeldingOldFormat,
} from "@/data/sykmelding/types/SykmeldingOldFormat";
import { tilLesbarDatoMedArstall } from "@/utils/datoUtils";
import SykmeldingPerioder from "./SykmeldingPerioder";
import { Egenmeldingsdager } from "./Egenmeldingsdager";
import {
  BodyLong,
  BodyShort,
  Checkbox,
  Heading,
  Label,
} from "@navikt/ds-react";
import MulighetForArbeid from "@/sider/sykmeldinger/sykmelding/sykmeldingOpplysninger/flereopplysninger/MulighetForArbeid";
import Friskmelding from "@/sider/sykmeldinger/sykmelding/sykmeldingOpplysninger/flereopplysninger/Friskmelding";
import UtdypendeOpplysninger from "@/sider/sykmeldinger/sykmelding/sykmeldingOpplysninger/flereopplysninger/UtdypendeOpplysninger";
import BedreArbeidsevne from "@/sider/sykmeldinger/sykmelding/sykmeldingOpplysninger/flereopplysninger/BedreArbeidsevne";
import MeldingTilNav from "@/sider/sykmeldinger/sykmelding/sykmeldingOpplysninger/flereopplysninger/MeldingTilNav";
import MeldingTilArbeidsgiver from "@/sider/sykmeldinger/sykmelding/sykmeldingOpplysninger/flereopplysninger/MeldingTilArbeidsgiver";
import Tilbakedatering from "@/sider/sykmeldinger/sykmelding/sykmeldingOpplysninger/flereopplysninger/Tilbakedatering";
import AndreSykmeldingOpplysninger from "@/sider/sykmeldinger/sykmelding/sykmeldingOpplysninger/flereopplysninger/AndreSykmeldingOpplysninger";

const texts = {
  sykmelding: "Sykmelding",
  avventendeSykmelding: "Avventende sykmelding",
  diagnose: "Diagnose",
  bidiagnose: "Bidiagnose",
  lovfestetFravaersgrunn: "Lovfestet fraværsgrunn",
  beskrivFravaeret: "Beskriv fraværet",
  yrkesskadeTittel: "Sykdommen kan skyldes en skade/yrkessykdom",
  arbeidsforTittel: "Pasienten er 100 % arbeidsfør etter perioden",
  avsenderTittel: "Lege / sykmelder",
  arbeidsgiverTittel: "Arbeidsgiver som legen har skrevet inn",
  hensynTittel: "Beskriv eventuelle hensyn som må tas på arbeidsplassen",
  svangerskapTittel: "Sykdommen er svangerskapsrelatert",
  utstedelsesdato: "Dato sykmeldingen ble skrevet",
  skadedato: "Skadedato",
};

const getStillingsprosentText = (stillingsprosent?: number) => {
  return `${stillingsprosent} % stilling`;
};

function Hoveddiagnose({
  hoveddiagnose,
}: {
  hoveddiagnose: SykmeldingDiagnose;
}) {
  return (
    <div className="mb-5">
      <Label size="small">{texts.diagnose}</Label>
      <BodyShort size="small">{`${hoveddiagnose.diagnose}`}</BodyShort>
      <BodyShort size="small">{`(${hoveddiagnose.diagnosekode}, ${hoveddiagnose.diagnosesystem})`}</BodyShort>
    </div>
  );
}

function Bidiagnoser({ bidiagnoser }: { bidiagnoser: SykmeldingDiagnose[] }) {
  return (
    <>
      {bidiagnoser.map((bidiagnose, index) => {
        return (
          <div key={index} className="mb-5">
            <Label size="small">{texts.bidiagnose}</Label>
            <BodyShort size="small">{bidiagnose.diagnose}</BodyShort>
            <BodyShort size="small">{`(${bidiagnose.diagnosekode}, ${bidiagnose.diagnosesystem})`}</BodyShort>
          </div>
        );
      })}
    </>
  );
}

interface Props {
  sykmelding: SykmeldingOldFormat;
}

export function SykmeldingOpplysninger({ sykmelding }: Props) {
  const erMulighetForArbeid =
    sykmelding.mulighetForArbeid.aktivitetIkkeMulig433?.length ||
    sykmelding.mulighetForArbeid.aarsakAktivitetIkkeMulig433 ||
    sykmelding.mulighetForArbeid.aktivitetIkkeMulig434?.length ||
    sykmelding.mulighetForArbeid.aarsakAktivitetIkkeMulig434;
  return (
    <div>
      <Heading level="2" size="large" className="mb-3">
        {sykmelding.mulighetForArbeid.perioder.some((periode) => {
          return !!periode.avventende;
        })
          ? texts.avventendeSykmelding
          : texts.sykmelding}
      </Heading>
      <div>
        <SykmeldingPerioder perioder={sykmelding.mulighetForArbeid.perioder} />
        {sykmelding.sporsmal.egenmeldingsdager &&
          sykmelding.sporsmal.egenmeldingsdager.length > 0 && (
            <Egenmeldingsdager
              egenmeldingsdager={sykmelding.sporsmal.egenmeldingsdager}
            />
          )}
        {!!sykmelding.diagnose.hoveddiagnose && (
          <Hoveddiagnose hoveddiagnose={sykmelding.diagnose.hoveddiagnose} />
        )}
        {sykmelding.diagnose.bidiagnoser && (
          <Bidiagnoser bidiagnoser={sykmelding.diagnose.bidiagnoser} />
        )}
        {sykmelding.diagnose.fravaersgrunnLovfestet && (
          <div className="mb-5">
            <Heading level="4" size="xsmall" className="mb-1">
              {texts.lovfestetFravaersgrunn}
            </Heading>
            <BodyLong size="small">
              {sykmelding.diagnose.fravaersgrunnLovfestet}
            </BodyLong>
          </div>
        )}
        {sykmelding.diagnose.fravaerBeskrivelse && (
          <div className="mb-5">
            <Heading level="4" size="xsmall" className="mb-1">
              {texts.beskrivFravaeret}
            </Heading>
            <BodyLong size="small">
              {sykmelding.diagnose.fravaerBeskrivelse}
            </BodyLong>
          </div>
        )}
        {sykmelding.diagnose.svangerskap && (
          <Checkbox checked readOnly size="small" className="mb-4">
            {texts.svangerskapTittel}
          </Checkbox>
        )}
        {sykmelding.diagnose.yrkesskadeDato && (
          <div className="mb-4">
            <Checkbox checked readOnly size="small">
              {texts.yrkesskadeTittel}
            </Checkbox>
            <div className="ml-6">
              <BodyShort size="small" weight="semibold">
                {texts.skadedato}
              </BodyShort>
              <BodyShort size="small">
                {tilLesbarDatoMedArstall(sykmelding.diagnose.yrkesskadeDato)}
              </BodyShort>
            </div>
          </div>
        )}
        {sykmelding.friskmelding.arbeidsfoerEtterPerioden && (
          <Checkbox checked readOnly size="small" className="mb-4">
            {texts.arbeidsforTittel}
          </Checkbox>
        )}
        {sykmelding.friskmelding.hensynPaaArbeidsplassen && (
          <div className="mb-5">
            <Heading level="4" size="xsmall" className="mb-1">
              {texts.hensynTittel}
            </Heading>
            <BodyLong size="small">
              {sykmelding.friskmelding.hensynPaaArbeidsplassen}
            </BodyLong>
          </div>
        )}
        {sykmelding.arbeidsgiver && (
          <div className="mb-5">
            <Heading level="4" size="xsmall" className="mb-1">
              {texts.arbeidsgiverTittel}
            </Heading>
            <BodyShort size="small">{sykmelding.arbeidsgiver}</BodyShort>
            {sykmelding.stillingsprosent && (
              <BodyShort size="small">
                {getStillingsprosentText(sykmelding.stillingsprosent)}
              </BodyShort>
            )}
          </div>
        )}
        {sykmelding.bekreftelse.sykmelder && (
          <div className="mb-5">
            <Heading level="4" size="xsmall" className="mb-1">
              {texts.avsenderTittel}
            </Heading>
            <BodyLong size="small">{sykmelding.bekreftelse.sykmelder}</BodyLong>
          </div>
        )}
      </div>
      <div>
        {sykmelding.bekreftelse.utstedelsesdato && (
          <div className="mb-5">
            <Heading level="4" size="xsmall" className="mb-1">
              {texts.utstedelsesdato}
            </Heading>
            <BodyShort size="small">
              {tilLesbarDatoMedArstall(sykmelding.bekreftelse.utstedelsesdato)}
            </BodyShort>
          </div>
        )}
        {erMulighetForArbeid && <MulighetForArbeid sykmelding={sykmelding} />}
        <Friskmelding sykmelding={sykmelding} />
        <UtdypendeOpplysninger sykmelding={sykmelding} />
        <BedreArbeidsevne sykmelding={sykmelding} />
        <MeldingTilNav sykmelding={sykmelding} />
        <MeldingTilArbeidsgiver sykmelding={sykmelding} />
        <Tilbakedatering sykmelding={sykmelding} />
        <AndreSykmeldingOpplysninger sykmelding={sykmelding} />
      </div>
    </div>
  );
}
