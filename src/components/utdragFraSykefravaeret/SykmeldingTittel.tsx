import {
  erSykmeldingUtenArbeidsgiver,
  SykmeldingOldFormat,
  SykmeldingStatus,
} from "@/data/sykmelding/types/SykmeldingOldFormat";
import {
  arbeidsgivernavnEllerArbeidssituasjon,
  erEkstraInformasjonISykmeldingen,
  stringMedAlleGraderingerFraSykmeldingPerioder,
  sykmeldingperioderSortertEldstTilNyest,
} from "@/utils/sykmeldinger/sykmeldingUtils";
import { tilLesbarPeriodeMedArstall } from "@/utils/datoUtils";
import { senesteTom, tidligsteFom } from "@/utils/periodeUtils";
import { Tag } from "@navikt/ds-react";
import ImportantInformationIcon from "@/components/ImportantInformationIcon";
import React from "react";

const texts = {
  utenArbeidsgiver: "Uten arbeidsgiver",
  ny: "Ikke tatt i bruk",
  papirTag: "Papir",
  utenlandskTag: "Utenlandsk",
};

function Info({ label, text }: { label: string; text: string }) {
  return (
    <div className="text-base font-normal">
      <b>{label}</b>
      <span>{text}</span>
    </div>
  );
}

interface Props {
  sykmelding: SykmeldingOldFormat;
}

export function SykmeldingTittel({ sykmelding }: Props) {
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
    <div className="w-full flex flex-col print:z-10">
      <div className="flex gap-4 mb-2">
        <div>
          {periode}
          {graderinger}
        </div>
        <div className="flex gap-4">
          {erIkkeTattIBruk && (
            <Tag data-color="warning" variant="outline" size="small">
              {texts.ny}
            </Tag>
          )}
          {erUtenArbeidsgiver && (
            <Tag data-color="info" variant="outline" size="small">
              {texts.utenArbeidsgiver}
            </Tag>
          )}
          {erViktigInformasjon && <ImportantInformationIcon />}
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
      {sykmelding.papirsykmelding && (
        <Tag
          data-color="neutral"
          className="w-max"
          variant="outline"
          size="small"
        >
          {texts.papirTag}
        </Tag>
      )}
      {sykmelding.utenlandskSykmelding && (
        <Tag
          data-color="neutral"
          className="w-max"
          variant="outline"
          size="small"
        >
          {texts.utenlandskTag}
        </Tag>
      )}
    </div>
  );
}
