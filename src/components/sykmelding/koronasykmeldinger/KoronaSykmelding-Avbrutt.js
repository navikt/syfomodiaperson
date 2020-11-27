import React from "react";
import { Utvidbar, sykmelding as sykmeldingPt } from "@navikt/digisyfo-npm";
import { Undertittel } from "nav-frontend-typografi";
import SykmeldingStatuspanel from "../../sykmeldingstatuspanel/SykmeldingStatuspanel";
import DineKoronaSykmeldingOpplysninger from "../sykmeldingOpplysninger/DineKoronaSykmeldingOpplysninger";

const texts = {
  pageSubtitle: "for selvstendig næringsdrivende og frilansere",
  expandableTitle: "Dine opplysninger",
};

const KoronaSykmeldingAvbrutt = ({ sykmelding }) => {
  return (
    <div>
      <Undertittel style={{ marginBottom: "2.5rem", textAlign: "center" }}>
        {texts.pageSubtitle}
      </Undertittel>
      <SykmeldingStatuspanel sykmelding={sykmelding} />
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
        <DineKoronaSykmeldingOpplysninger sykmelding={sykmelding} />
      </Utvidbar>
    </div>
  );
};

KoronaSykmeldingAvbrutt.propTypes = {
  sykmelding: sykmeldingPt,
};

export default KoronaSykmeldingAvbrutt;
