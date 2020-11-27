import React from "react";
import { Bjorn, sykmelding as sykmeldingPt } from "@navikt/digisyfo-npm";
import { Undertittel, Normaltekst } from "nav-frontend-typografi";
import { Knapp } from "nav-frontend-knapper";
import DineKoronaSykmeldingOpplysninger from "../sykmeldingOpplysninger/DineKoronaSykmeldingOpplysninger";

const texts = {
  pageSubtitle: "for selvstendig næringsdrivende og frilansere",
  infotext1:
    "Her sjekker du at opplysningene fra når du opprettet egenmeldingen stemmer. Om alt stemmer kan du bekrefte og sende inn egenmeldingen.",
  infoText2:
    "Vennligst se nøye over at opplysningene du har oppgitt er riktige.",
  button: "Gå til utfyllingen",
};

const KoronaSykmeldingNy = ({ sykmelding }) => {
  return (
    <div>
      <Undertittel style={{ marginBottom: "2.5rem", textAlign: "center" }}>
        {texts.pageSubtitle}
      </Undertittel>
      <Bjorn className="blokk" hvit stor>
        <Normaltekst style={{ marginBottom: "1rem" }}>
          {texts.infotext1}
        </Normaltekst>
        <Normaltekst>{texts.infoText2}</Normaltekst>
        <div className="skjul-pa-desktop">
          <Knapp mini disabled style={{ marginTop: "2rem" }}>
            {texts.button}
          </Knapp>
        </div>
      </Bjorn>
      <article>
        <header className="panelHeader panelHeader--lysebla">
          <img
            className="panelHeader__ikon"
            src="/sykefravaer/img/svg/person.svg"
            alt="Du"
          />
          <h2 className="panelHeader__tittel">
            {sykmelding.pasient.fornavn} {sykmelding.pasient.mellomnavn}{" "}
            {sykmelding.pasient.etternavn}
          </h2>
        </header>
        <div className="panel blokk">
          <DineKoronaSykmeldingOpplysninger sykmelding={sykmelding} />
        </div>
      </article>
    </div>
  );
};

KoronaSykmeldingNy.propTypes = {
  sykmelding: sykmeldingPt,
};

export default KoronaSykmeldingNy;
