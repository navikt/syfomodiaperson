import React from "react";
import { SykmeldingOldFormat } from "@/data/sykmelding/types/SykmeldingOldFormat";
import { tidligsteFom } from "@/utils/periodeUtils";
import { tilLesbarDatoMedArstall } from "@/utils/datoUtils";
import SykmeldingPerioder from "./SykmeldingPerioder";
import { SykmeldingCheckbox } from "./SykmeldingCheckbox";
import FlereOpplysninger from "./flereopplysninger/FlereOpplysninger";
import { SykmeldingCheckboxForFelt } from "./SykmeldingCheckboxForFelt";
import { Egenmeldingsdager } from "./Egenmeldingsdager";
import { Heading } from "@navikt/ds-react";
import { Nokkelopplysning } from "@/sider/sykmeldinger/sykmelding/sykmeldingOpplysninger/Nokkelopplysning";
import { RadContainer } from "@/sider/sykmeldinger/sykmelding/sykmeldingOpplysninger/RadContainer";

const texts = {
  dinSykmeldingTittel: "Sykmelding",
  dinSykmeldingDiagnoseTittel: "Diagnose\n",
  dinSykmeldingBidiagnoseTittel: "Bidiagnose\n",
  yrkesskadeTittel: "Sykdommen kan skyldes en skade/yrkessykdom\n",
  diagnoseMeta: "Diagnosen vises ikke til arbeidsgiveren",
  arbeidsforTittel: "Pasienten er 100 % arbeidsfør etter perioden\n",
  avsenderTittel: "Lege / sykmelder\n",
  arbeidsgiverTittel: "Arbeidsgiver som legen har skrevet inn",
  hensynTittel: "Beskriv eventuelle hensyn som må tas på arbeidsplassen\n",
  svangerskapTittel: "Sykdommen er svangerskapsrelatert\n\n",
};

const getStillingsprosentText = (stillingsprosent?: number) => {
  return `${stillingsprosent} % stilling`;
};

interface Props {
  sykmelding: SykmeldingOldFormat;
}

export function SykmeldingOpplysninger({ sykmelding }: Props) {
  return (
    <div className="dine-opplysninger">
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
        {sykmelding.diagnose.hoveddiagnose ? (
          <RadContainer>
            <Nokkelopplysning
              label={texts.dinSykmeldingDiagnoseTittel}
              className={"mb-0"}
            >
              <p>{sykmelding.diagnose.hoveddiagnose.diagnose}</p>
              <p>{texts.diagnoseMeta}</p>
            </Nokkelopplysning>
            <Nokkelopplysning
              label={texts.dinSykmeldingDiagnoseTittel}
              className={"mb-0"}
            >
              <p>
                <span>{sykmelding.diagnose.hoveddiagnose.diagnosekode}</span>
                &nbsp;
                <span>{sykmelding.diagnose.hoveddiagnose.diagnosesystem}</span>
              </p>
            </Nokkelopplysning>
          </RadContainer>
        ) : null}
        {sykmelding.diagnose.bidiagnoser &&
          sykmelding.diagnose.bidiagnoser.map((bidiagnose, index) => {
            return (
              <RadContainer key={`${sykmelding.id}-bidiagnose-${index}`}>
                <Nokkelopplysning label={texts.dinSykmeldingBidiagnoseTittel}>
                  <p>{bidiagnose.diagnose}</p>
                  <p>{texts.diagnoseMeta}</p>
                </Nokkelopplysning>
                <Nokkelopplysning label={texts.dinSykmeldingDiagnoseTittel}>
                  <p>
                    <span>{bidiagnose.diagnosekode}</span>
                    <span>{bidiagnose.diagnosesystem}</span>
                  </p>
                </Nokkelopplysning>
              </RadContainer>
            );
          })}
        {sykmelding.diagnose.fravaersgrunnLovfestet ? (
          <Nokkelopplysning label={"Lovfestet fraværsgrunn"}>
            <p>{sykmelding.diagnose.fravaersgrunnLovfestet}</p>
          </Nokkelopplysning>
        ) : null}
        {sykmelding.diagnose.fravaerBeskrivelse ? (
          <Nokkelopplysning label={"Beskriv fraværet"}>
            <p>{sykmelding.diagnose.fravaerBeskrivelse}</p>
          </Nokkelopplysning>
        ) : null}
        <SykmeldingCheckboxForFelt
          sykmeldingBolk={sykmelding.diagnose}
          felt="svangerskap"
          tekst={texts.svangerskapTittel}
          className="blokk"
        />
        {!sykmelding.diagnose.yrkesskadeDato ? null : (
          <SykmeldingCheckbox tekst={texts.yrkesskadeTittel} />
        )}
        {!sykmelding.diagnose.yrkesskadeDato ? null : (
          <Nokkelopplysning label={"Skadedato"} isSubopplysning={true}>
            <p>{tilLesbarDatoMedArstall(sykmelding.diagnose.yrkesskadeDato)}</p>
          </Nokkelopplysning>
        )}
        <SykmeldingCheckboxForFelt
          sykmeldingBolk={sykmelding.friskmelding}
          felt="arbeidsfoerEtterPerioden"
          tekst={texts.arbeidsforTittel}
          className="blokk"
        />
        {!sykmelding.friskmelding.hensynPaaArbeidsplassen ? null : (
          <Nokkelopplysning label={texts.hensynTittel}>
            <p>{sykmelding.friskmelding.hensynPaaArbeidsplassen}</p>
          </Nokkelopplysning>
        )}
        {sykmelding.arbeidsgiver ? (
          <Nokkelopplysning label={texts.arbeidsgiverTittel}>
            <p className={"mb-0"}>{sykmelding.arbeidsgiver}</p>
            {sykmelding.stillingsprosent ? (
              <p>{getStillingsprosentText(sykmelding.stillingsprosent)}</p>
            ) : null}
          </Nokkelopplysning>
        ) : null}
        {sykmelding.bekreftelse.sykmelder ? (
          <Nokkelopplysning label={texts.avsenderTittel}>
            <p>{sykmelding.bekreftelse.sykmelder}</p>
          </Nokkelopplysning>
        ) : null}
      </div>
      <FlereOpplysninger sykmelding={sykmelding} />
    </div>
  );
}
