import React from "react";
import { Utvidbar, sykmelding as sykmeldingPt } from "@navikt/digisyfo-npm";
import { Undertittel } from "nav-frontend-typografi";
import BekreftetSykmeldingStatuspanel from "../../sykmeldingstatuspanel/BekreftetSykmeldingStatuspanel";
import DineKoronaSykmeldingOpplysninger from "../sykmeldingOpplysninger/DineKoronaSykmeldingOpplysninger";

const texts = {
  pageSubtitle: "for selvstendig næringsdrivende og frilansere",
  expandableTitle: "Dine opplysninger",
};

const KoronaSykmeldingBekreftet = ({ dinSykmelding }) => {
  return (
    <div>
      <Undertittel style={{ marginBottom: "2.5rem", textAlign: "center" }}>
        {texts.pageSubtitle}
      </Undertittel>
      <BekreftetSykmeldingStatuspanel sykmelding={dinSykmelding} />
      <Utvidbar
        erApen
        tittel={texts.expandableTitle}
        ikon="svg/person.svg"
        ikonHover="svg/person_hover.svg"
        ikonAltTekst="Du"
        className="blokk"
        variant="lysebla"
        Overskrift="h2"
      >
        <DineKoronaSykmeldingOpplysninger sykmelding={dinSykmelding} />
      </Utvidbar>
    </div>
  );
};

KoronaSykmeldingBekreftet.propTypes = {
  dinSykmelding: sykmeldingPt,
};

export default KoronaSykmeldingBekreftet;
