import React from "react";
import {
  SykmeldingDiagnose,
  SykmeldingOldFormat,
} from "@/data/sykmelding/types/SykmeldingOldFormat";
import { tilLesbarDatoMedArstall } from "@/utils/datoUtils";
import SykmeldingPerioder from "./SykmeldingPerioder";
import { Egenmeldingsdager } from "./Egenmeldingsdager";
import { BodyShort, Checkbox, Heading, Label } from "@navikt/ds-react";
import { Nokkelopplysning } from "@/sider/sykmeldinger/sykmelding/sykmeldingOpplysninger/Nokkelopplysning";
import SykmeldingOpplysningForFelt from "@/sider/sykmeldinger/sykmelding/sykmeldingOpplysninger/flereopplysninger/SykmeldingOpplysningForFelt";
import MulighetForArbeid from "@/sider/sykmeldinger/sykmelding/sykmeldingOpplysninger/flereopplysninger/MulighetForArbeid";
import Friskmelding from "@/sider/sykmeldinger/sykmelding/sykmeldingOpplysninger/flereopplysninger/Friskmelding";
import UtdypendeOpplysninger from "@/sider/sykmeldinger/sykmelding/sykmeldingOpplysninger/flereopplysninger/UtdypendeOpplysninger";
import BedreArbeidsevne from "@/sider/sykmeldinger/sykmelding/sykmeldingOpplysninger/flereopplysninger/BedreArbeidsevne";
import MeldingTilNav from "@/sider/sykmeldinger/sykmelding/sykmeldingOpplysninger/flereopplysninger/MeldingTilNav";
import MeldingTilArbeidsgiver from "@/sider/sykmeldinger/sykmelding/sykmeldingOpplysninger/flereopplysninger/MeldingTilArbeidsgiver";
import Tilbakedatering from "@/sider/sykmeldinger/sykmelding/sykmeldingOpplysninger/flereopplysninger/Tilbakedatering";
import AndreSykmeldingOpplysninger from "@/sider/sykmeldinger/sykmelding/sykmeldingOpplysninger/flereopplysninger/AndreSykmeldingOpplysninger";

const texts = {
  dinSykmeldingTittel: "Sykmelding",
  dinSykmeldingDiagnoseTittel: "Diagnose\n",
  dinSykmeldingBidiagnoseTittel: "Bidiagnose\n",
  yrkesskadeTittel: "Sykdommen kan skyldes en skade/yrkessykdom\n",
  arbeidsforTittel: "Pasienten er 100 % arbeidsfør etter perioden\n",
  avsenderTittel: "Lege / sykmelder\n",
  arbeidsgiverTittel: "Arbeidsgiver som legen har skrevet inn",
  hensynTittel: "Beskriv eventuelle hensyn som må tas på arbeidsplassen\n",
  svangerskapTittel: "Sykdommen er svangerskapsrelatert\n\n",
  utstedelsesdato: "Dato sykmeldingen ble skrevet",
  skadedato: "Skadedato",
};

const getStillingsprosentText = (stillingsprosent?: number) => {
  return `${stillingsprosent} % stilling`;
};

interface Props {
  sykmelding: SykmeldingOldFormat;
}

function Hoveddiagnose({
  hoveddiagnose,
}: {
  hoveddiagnose: SykmeldingDiagnose;
}) {
  return (
    <div className="flex flex-col mb-5">
      <Label size="small">{texts.dinSykmeldingDiagnoseTittel}</Label>
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
          <div key={index} className="flex flex-col mb-5">
            <Label size="small">{texts.dinSykmeldingBidiagnoseTittel}</Label>
            <BodyShort size="small">{bidiagnose.diagnose}</BodyShort>
            <BodyShort size="small">{`(${bidiagnose.diagnosekode}, ${bidiagnose.diagnosesystem})`}</BodyShort>
          </div>
        );
      })}
    </>
  );
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
          ? "Avventende sykmelding"
          : texts.dinSykmeldingTittel}
      </Heading>
      <div className="side-innhold">
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
          <Nokkelopplysning label={"Lovfestet fraværsgrunn"}>
            <p>{sykmelding.diagnose.fravaersgrunnLovfestet}</p>
          </Nokkelopplysning>
        )}
        {sykmelding.diagnose.fravaerBeskrivelse && (
          <Nokkelopplysning label={"Beskriv fraværet"}>
            <p>{sykmelding.diagnose.fravaerBeskrivelse}</p>
          </Nokkelopplysning>
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
          <Nokkelopplysning label={texts.hensynTittel}>
            <p>{sykmelding.friskmelding.hensynPaaArbeidsplassen}</p>
          </Nokkelopplysning>
        )}
        {sykmelding.arbeidsgiver && (
          <Nokkelopplysning label={texts.arbeidsgiverTittel}>
            <p className={"mb-0"}>{sykmelding.arbeidsgiver}</p>
            {sykmelding.stillingsprosent && (
              <p>{getStillingsprosentText(sykmelding.stillingsprosent)}</p>
            )}
          </Nokkelopplysning>
        )}
        {sykmelding.bekreftelse.sykmelder && (
          <Nokkelopplysning label={texts.avsenderTittel}>
            <p>{sykmelding.bekreftelse.sykmelder}</p>
          </Nokkelopplysning>
        )}
      </div>
      <div>
        <SykmeldingOpplysningForFelt
          sykmeldingBolk={sykmelding.bekreftelse}
          felt={"utstedelsesdato"}
          tittel={texts.utstedelsesdato}
          opplysning={tilLesbarDatoMedArstall(
            sykmelding.bekreftelse.utstedelsesdato
          )}
        />
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
