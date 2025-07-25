import React from "react";
import { SykmeldingOldFormat } from "@/data/sykmelding/types/SykmeldingOldFormat";
import SykmeldingPerioder from "./SykmeldingPerioder";
import { Egenmeldingsdager } from "./Egenmeldingsdager";
import { Heading } from "@navikt/ds-react";
import { Nokkelopplysning } from "@/sider/sykmeldinger/sykmelding/sykmeldingOpplysninger/Nokkelopplysning";
import { RadContainer } from "@/sider/sykmeldinger/sykmelding/sykmeldingOpplysninger/RadContainer";

const texts = {
  diagnose: "Diagnose",
  diagnosekode: "Diagnosekode",
};

interface Props {
  sykmelding: SykmeldingOldFormat;
}

export default function DineKoronaSykmeldingOpplysninger({
  sykmelding,
}: Props) {
  return (
    <div>
      <Heading size="medium" className="mb-6">
        Opplysninger
      </Heading>
      <div className="blokk-l side-innhold fjern-margin-bottom">
        <SykmeldingPerioder perioder={sykmelding.mulighetForArbeid.perioder} />
        {sykmelding.sporsmal.egenmeldingsdager &&
          sykmelding.sporsmal.egenmeldingsdager.length > 0 && (
            <Egenmeldingsdager
              egenmeldingsdager={sykmelding.sporsmal.egenmeldingsdager}
            />
          )}
        {sykmelding.diagnose.hoveddiagnose ? (
          <div className="md:mb-8">
            <RadContainer>
              <Nokkelopplysning label={texts.diagnose} className={"mb-0"}>
                <p>{sykmelding.diagnose.hoveddiagnose.diagnose}</p>
              </Nokkelopplysning>
              <Nokkelopplysning label={texts.diagnosekode} className={"mb-0"}>
                <p>
                  <span>{sykmelding.diagnose.hoveddiagnose.diagnosekode}</span>
                  &nbsp;
                  <span>
                    {sykmelding.diagnose.hoveddiagnose.diagnosesystem}
                  </span>
                </p>
              </Nokkelopplysning>
            </RadContainer>
          </div>
        ) : null}
      </div>
    </div>
  );
}
