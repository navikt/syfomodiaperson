import React from "react";
import { Link } from "react-router-dom";
import Alertstripe from "nav-frontend-alertstriper";
import { SykmeldingOldFormat } from "@/data/sykmelding/types/SykmeldingOldFormat";
import { DineSykmeldingOpplysninger } from "@/sider/sykmeldinger/sykmelding/sykmeldingOpplysninger/DineSykmeldingOpplysninger";

const texts = {
  eldreSykmeldinger: "Du har eldre sykmeldinger som du bør behandle før denne.",
  eldreSykmeldingerLenke: "Gå til den eldste sykmeldingen.",
  bjorn:
    "Hei, her sjekker du opplysningene fra den som sykmeldte deg. Stemmer det med det dere ble enige om? Du velger selv om du vil bruke sykmeldingen.",
};

interface Props {
  sykmelding: SykmeldingOldFormat;
  visEldreSykmeldingVarsel?: boolean;
  eldsteSykmeldingId?: string;
}

export function DinSykmelding(dinSykmeldingProps: Props) {
  const { sykmelding, visEldreSykmeldingVarsel, eldsteSykmeldingId } =
    dinSykmeldingProps;
  return (
    <>
      {visEldreSykmeldingVarsel && (
        <Alertstripe type="info">
          <p className="sist side-innhold">
            <span>{texts.eldreSykmeldinger} </span>
            <Link to={`/sykefravaer/sykmeldinger/${eldsteSykmeldingId}`}>
              {texts.eldreSykmeldingerLenke}
            </Link>
          </p>
        </Alertstripe>
      )}
      <DineSykmeldingOpplysninger sykmelding={sykmelding} />
    </>
  );
}
