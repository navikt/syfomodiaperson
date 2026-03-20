import React from "react";
import { SykmeldingOldFormat } from "@/data/sykmelding/types/SykmeldingOldFormat";
import SykmeldingPerioder from "./SykmeldingPerioder";
import { Egenmeldingsdager } from "./Egenmeldingsdager";
import { BodyLong, Heading } from "@navikt/ds-react";

const texts = {
  diagnose: "Diagnose",
  diagnosekode: "Diagnosekode",
};

interface Props {
  sykmelding: SykmeldingOldFormat;
}

export function KoronaSykmeldingOpplysninger({ sykmelding }: Props) {
  return (
    <div>
      <Heading size="medium" className="mb-6">
        Opplysninger
      </Heading>
      <div>
        <SykmeldingPerioder perioder={sykmelding.mulighetForArbeid.perioder} />
        {sykmelding.sporsmal.egenmeldingsdager &&
          sykmelding.sporsmal.egenmeldingsdager.length > 0 && (
            <Egenmeldingsdager
              egenmeldingsdager={sykmelding.sporsmal.egenmeldingsdager}
            />
          )}
        {sykmelding.diagnose.hoveddiagnose && (
          <div className="md:mb-8">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Heading size="xsmall" level="3" className="mb-1">
                  {texts.diagnose}
                </Heading>
                <p>{sykmelding.diagnose.hoveddiagnose.diagnose}</p>
              </div>
              <div>
                <Heading size="xsmall" level="3" className="mb-1">
                  {texts.diagnosekode}
                </Heading>
                <BodyLong>
                  <span>{sykmelding.diagnose.hoveddiagnose.diagnosekode}</span>
                  &nbsp;
                  <span>
                    {sykmelding.diagnose.hoveddiagnose.diagnosesystem}
                  </span>
                </BodyLong>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
