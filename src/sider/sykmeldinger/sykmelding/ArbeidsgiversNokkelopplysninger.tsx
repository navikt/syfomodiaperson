import React from "react";
import { SykmeldingOldFormat } from "@/data/sykmelding/types/SykmeldingOldFormat";
import SykmeldingPerioder from "./sykmeldingOpplysninger/SykmeldingPerioder";
import { SykmeldingCheckboxForFelt } from "./sykmeldingOpplysninger/SykmeldingCheckboxForFelt";
import { SladdImage } from "../../../../img/ImageComponents";
import { Nokkelopplysning } from "@/sider/sykmeldinger/sykmelding/sykmeldingOpplysninger/Nokkelopplysning";

const texts = {
  arbeidsgiver: "Arbeidsgiver som legen har skrevet inn",
  avsenderTittel: "Lege / sykmelder",
  diagnose: "Diagnose",
  diagnoseSkjult: "Diagnosen er skjult for arbeidsgiver",
  arbeidsfor: "Pasienten er 100 % arbeidsfør etter perioden",
  hensynTittel: "Beskriv eventuelle hensyn som må tas på arbeidsplassen",
};

const getStillingsprosentText = (stillingsprosent?: number) => {
  return `${stillingsprosent} % stilling`;
};

interface ArbeidsgiversNokkelopplysningerProps {
  sykmelding: SykmeldingOldFormat;
}

const ArbeidsgiversNokkelopplysninger = (
  arbeidsgiversNokkelopplysningerProps: ArbeidsgiversNokkelopplysningerProps
) => {
  const { sykmelding } = arbeidsgiversNokkelopplysningerProps;
  return (
    <div className="arbeidsgiversSykmelding__nokkelopplysninger">
      <SykmeldingPerioder perioder={sykmelding.mulighetForArbeid.perioder} />
      {!sykmelding.skalViseSkravertFelt ? null : (
        <Nokkelopplysning label={texts.diagnose}>
          <img src={SladdImage} alt={texts.diagnoseSkjult} />
        </Nokkelopplysning>
      )}
      <SykmeldingCheckboxForFelt
        sykmeldingBolk={sykmelding.friskmelding}
        felt="arbeidsfoerEtterPerioden"
        tekst={texts.arbeidsfor}
        className="blokk"
      />
      {!sykmelding.friskmelding.hensynPaaArbeidsplassen ? null : (
        <Nokkelopplysning label={texts.hensynTittel}>
          <p>{sykmelding.friskmelding.hensynPaaArbeidsplassen}</p>
        </Nokkelopplysning>
      )}
      {!sykmelding.arbeidsgiver ? null : (
        <Nokkelopplysning label={texts.arbeidsgiver}>
          <p className={"mb-0"}>{sykmelding.arbeidsgiver}</p>
          {sykmelding.stillingsprosent ? (
            <p>{getStillingsprosentText(sykmelding.stillingsprosent)}</p>
          ) : null}
        </Nokkelopplysning>
      )}
      {!sykmelding.bekreftelse.sykmelder ? null : (
        <Nokkelopplysning label={texts.avsenderTittel}>
          <p>{sykmelding.bekreftelse.sykmelder}</p>
        </Nokkelopplysning>
      )}
    </div>
  );
};

export default ArbeidsgiversNokkelopplysninger;
