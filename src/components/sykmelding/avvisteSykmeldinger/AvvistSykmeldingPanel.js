import React from "react";
import PropTypes from "prop-types";
import Veilederpanel from "nav-frontend-veilederpanel";
import * as avvisningsregelnavn from "../../../utils/sykmeldinger/avvisningsregelnavn";
import VeiledermannIkon from "../../../ikoner/VeiledermannIkon";

const REGELNAVN_INGEN_RETT_TIL_A_SYKMELDE = [
  avvisningsregelnavn.BEHANDLER_IKKE_GYLDIG_I_HPR,
  avvisningsregelnavn.BEHANDLER_MANGLER_AUTORISASJON_I_HPR,
  avvisningsregelnavn.BEHANDLER_IKKE_LE_KI_MT_TL_FT_I_HPR,
  avvisningsregelnavn.BEHANDLER_SUSPENDERT,
];

const avvistSykmeldingFilter = (sykmelding) => {
  return sykmelding.behandlingsutfall.ruleHits.filter((rule) => {
    return rule.ruleStatus === null || rule.ruleStatus === "INVALID";
  });
};

const hentRegelnavnListe = (sykmelding) => {
  return sykmelding.behandlingsutfall.ruleHits.map((ruleHit) => {
    return ruleHit.ruleName;
  });
};

const hentHarIkkeRettTilASykmelde = (sykmelding) => {
  return hentRegelnavnListe(sykmelding).reduce((acc, regelnavn) => {
    return acc || REGELNAVN_INGEN_RETT_TIL_A_SYKMELDE.includes(regelnavn);
  }, false);
};

export const hentHandlingsstreng = (sykmelding) => {
  const regelnavnliste = hentRegelnavnListe(sykmelding);

  const brukerErOver70 = regelnavnliste.find((regelnavn) => {
    return regelnavn === avvisningsregelnavn.PASIENT_ELDRE_ENN_70;
  });
  const ugyldigVersjon = regelnavnliste.find((regelnavn) => {
    return regelnavn === avvisningsregelnavn.UGYLDIG_REGELSETTVERSJON;
  });
  const ikkeRettTilASykmelde = hentHarIkkeRettTilASykmelde(sykmelding);

  if (brukerErOver70) {
    return "Du kan i stedet be om en skriftlig bekreftelse på at du er syk. ";
  }

  if (ugyldigVersjon) {
    return "Du bør kontakte den som har sykmeldt deg eller få sykmelding fra en annen behandler. ";
  }

  if (ikkeRettTilASykmelde) {
    return "Du må oppsøke en som har rett til å sykmelde. ";
  }

  return `Når du har fått ny sykmelding fra ${sykmelding.bekreftelse.sykmelder}, får du en ny beskjed fra oss om å logge deg inn på nav.no slik at du kan sende inn sykmeldingen.\nGår det mange dager, bør du kontakte ${sykmelding.bekreftelse.sykmelder} som skal skrive den nye sykmeldingen.`;
};

const hentIntrotekst = (sykmelding) => {
  const intro = "Du trenger en ny sykmelding fordi";
  const standardtekst = `${intro} det er gjort en feil i utfyllingen. Vi har gitt beskjed til ${sykmelding.bekreftelse.sykmelder} om hva som er feil, og at du må få en ny sykmelding.`;
  const overSyttitekst = `${intro} du er over 70 år. `;
  const ugyldigSykmeldingversjonTekst = `${intro} det er brukt en ugyldig versjon av sykmeldingen. `;
  const ingenAutorisasjonTekst = `${intro} den som skrev sykmeldingen manglet autorisasjon.`;
  const regelnavnliste = hentRegelnavnListe(sykmelding);
  if (regelnavnliste.includes(avvisningsregelnavn.PASIENT_ELDRE_ENN_70)) {
    return overSyttitekst;
  }

  if (regelnavnliste.includes(avvisningsregelnavn.UGYLDIG_REGELSETTVERSJON)) {
    return ugyldigSykmeldingversjonTekst;
  }

  if (hentHarIkkeRettTilASykmelde(sykmelding)) {
    return ingenAutorisasjonTekst;
  }
  return standardtekst;
};

const BegrunnelseTekst = ({ sykmelding }) => {
  const overskrift = "Grunnen til at sykmeldingen er avvist:";
  return (
    <React.Fragment>
      <h3 className="typo-element" style={{ marginBottom: "1em" }}>
        {overskrift}
      </h3>
      {sykmelding.behandlingsutfall.ruleHits.length === 1 ? (
        <p>{sykmelding.behandlingsutfall.ruleHits[0].messageForUser}</p>
      ) : (
        <ul>
          {avvistSykmeldingFilter(sykmelding).map((ruleHit) => {
            return <li key={ruleHit.ruleName}>{ruleHit.messageForUser}</li>;
          })}
        </ul>
      )}
    </React.Fragment>
  );
};

BegrunnelseTekst.propTypes = {
  sykmelding: PropTypes.object,
};

const Begrunnelse = ({ sykmelding }) => {
  const reglerUtenBegrunnelse = [
    avvisningsregelnavn.PASIENT_ELDRE_ENN_70,
    avvisningsregelnavn.UGYLDIG_REGELSETTVERSJON,
    avvisningsregelnavn.BEHANDLER_IKKE_GYLDIG_I_HPR,
    avvisningsregelnavn.BEHANDLER_MANGLER_AUTORISASJON_I_HPR,
    avvisningsregelnavn.BEHANDLER_IKKE_LE_KI_MT_TL_FT_I_HPR,
    avvisningsregelnavn.BEHANDLER_SUSPENDERT,
  ];
  const visBegrunnelse =
    sykmelding &&
    sykmelding.behandlingsutfall &&
    sykmelding.behandlingsutfall.ruleHits &&
    !sykmelding.behandlingsutfall.ruleHits.reduce((acc, ruleHit) => {
      return acc || reglerUtenBegrunnelse.includes(ruleHit.ruleName);
    }, false);

  return visBegrunnelse ? <BegrunnelseTekst sykmelding={sykmelding} /> : null;
};

Begrunnelse.propTypes = {
  sykmelding: PropTypes.object,
};

export const AvvistSykmeldingPanel = ({ sykmelding }) => {
  const handlingstreng = hentHandlingsstreng(sykmelding);
  const introtekststreng = hentIntrotekst(sykmelding);
  return (
    <div className="blokk">
      <Veilederpanel
        fargetema="feilmelding"
        type="plakat"
        center
        kompakt
        svg={<VeiledermannIkon />}
        veilederProps={{ center: true, storrelse: "S" }}
      >
        <h2 className="veilederpanel__tittel">
          Sykmeldingen kan dessverre ikke brukes
        </h2>
        <p>Beklager at vi må bry deg mens du er syk.</p>
        <p>{introtekststreng}</p>
        <p>{handlingstreng}</p>
        <Begrunnelse sykmelding={sykmelding} />
      </Veilederpanel>
    </div>
  );
};

AvvistSykmeldingPanel.propTypes = {
  sykmelding: PropTypes.object,
};
