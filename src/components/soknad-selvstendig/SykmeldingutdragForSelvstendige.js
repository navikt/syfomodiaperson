import React from "react";
import PropTypes from "prop-types";
import {
  Bjorn,
  sykmelding as sykmeldingPt,
  SykmeldingNokkelOpplysning,
  SykmeldingPerioder,
  tilLesbarDatoMedArstall,
  Utvidbar,
} from "@navikt/digisyfo-npm";
import {
  SykmeldingopplysningForsikring,
  SykmeldingopplysningFravaersperioder,
} from "../sykmeldingstatuspanel/SykmeldingStatuspanelOpplysning";

const texts = {
  datoSykmelding: "Dato sykmeldingen ble skrevet",
  passer: "Hva passer best for deg?",
  opplysninger: "Opplysninger fra sykmeldingen",

  status: {
    tittel: "Status",
    frilanser: ["Jeg er frilanser", "jobb som frilanser"],
    arbeidstaker: ["Jeg er ansatt", "jobb hos en arbeidsgiver"],
    arbeidsledig: "Jeg er arbeidsledig",
    naeringsdrivende: [
      "Jeg er selvstendig næringsdrivende",
      "jobb som selvstendig næringsdrivende",
    ],
    annet: ["Annet", "Jeg finner ingenting som passer for meg"],
    arbeidstakerAnnenArbeidsgiver: "jobb hos en annen arbeidsgiver",
    default: "Velg situasjon",
  },
};

const textArbeidssituasjon = (arbeidssituasjon) => {
  switch (arbeidssituasjon) {
    case "frilanser":
      return texts.status.frilanser[0];
    case "frilanser.2":
      return texts.status.frilanser[1];
    case "arbeidstaker":
      return texts.status.arbeidstaker[0];
    case "arbeidstaker.2":
      return texts.status.arbeidstaker[1];
    case "arbeidsledig":
    case "arbeidsledig.2":
      return texts.status.arbeidsledig;
    case "naeringsdrivende":
      return texts.status.naeringsdrivende[0];
    case "naeringsdrivende.2":
      return texts.status.naeringsdrivende[1];
    case "annet":
      return texts.status.annet[0];
    case "annet.2":
      return texts.status.annet[1];
    case "arbeidstaker-annen-arbeidsgiver.2":
      return texts.status.arbeidstakerAnnenArbeidsgiver;
    case "default":
    default:
      return texts.status.default;
  }
};

const SykmeldingUtdragForSelvstendige = ({ erApen, sykmelding, erOppdelt }) => {
  return (
    <Utvidbar
      className="blokk js-sykmelding-utdrag"
      Overskrift="h2"
      erApen={erApen}
      visLukklenke={!erApen}
      tittel={texts.opplysninger}
      variant="lilla"
      ikon="svg/plaster.svg"
      ikonHover="svg/plaster_hover.svg"
      ikonAltTekst="Plaster-ikon"
    >
      <div>
        <SykmeldingPerioder perioder={sykmelding.mulighetForArbeid.perioder} />
        {erOppdelt && (
          <Bjorn
            rootUrl="/sykefravaer"
            className="blokk"
            nokkel="sykepengesoknad.sykmelding-utdrag.oppdelt.bjorn"
          />
        )}
        <SykmeldingNokkelOpplysning tittel={texts.datoSykmelding}>
          <p className="js-utstedelsesdato">
            {tilLesbarDatoMedArstall(sykmelding.bekreftelse.utstedelsesdato)}
          </p>
        </SykmeldingNokkelOpplysning>
        <SykmeldingNokkelOpplysning tittel={texts.passer}>
          <p className="js-arbeidssituasjon">
            {textArbeidssituasjon(
              sykmelding.valgtArbeidssituasjon.toLowerCase()
            )}
          </p>
        </SykmeldingNokkelOpplysning>
        <SykmeldingopplysningFravaersperioder sykmelding={sykmelding} />
        <SykmeldingopplysningForsikring sykmelding={sykmelding} />
      </div>
    </Utvidbar>
  );
};

SykmeldingUtdragForSelvstendige.propTypes = {
  erApen: PropTypes.bool,
  erOppdelt: PropTypes.bool,
  sykmelding: sykmeldingPt,
};

export default SykmeldingUtdragForSelvstendige;
