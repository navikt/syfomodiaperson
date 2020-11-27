import React from "react";
import PropTypes from "prop-types";
import { finnArbeidstakerMotebehovSvar } from "../../utils/motebehovUtils";
import { tilLesbarDatoMedArUtenManedNavn } from "../../utils/datoUtils";

export const lederMedGittAktorId = (aktorId, ledere) => {
  return ledere.find((leder) => {
    return leder.aktoerId === aktorId;
  });
};

export const arbeidsgiverNavnEllerTomStreng = (leder) => {
  return leder && leder.navn ? `${leder.navn}` : "";
};

export const setSvarIkon = (deltakerOnskerMote) => {
  switch (deltakerOnskerMote) {
    case true: {
      return "/sykefravaer/img/svg/motebehov--kan.svg";
    }
    case false: {
      return "/sykefravaer/img/svg/motebehov--kanikke.svg";
    }
    default: {
      return "/sykefravaer/img/svg/motebehov--ikkesvart.svg";
    }
  }
};

export const setSvarTekst = (deltakerOnskerMote) => {
  switch (deltakerOnskerMote) {
    case true: {
      return " har svart JA";
    }
    case false: {
      return " har svart NEI";
    }
    default: {
      return " har ikke svart";
    }
  }
};

const svarTidspunkt = (motebehov) => {
  return motebehov && motebehov.opprettetDato
    ? tilLesbarDatoMedArUtenManedNavn(motebehov.opprettetDato)
    : "Ikke svart";
};

const ikonAlternativTekst = (deltakerOnskerMote) => {
  switch (deltakerOnskerMote) {
    case true: {
      return "Svart ja.";
    }
    case false: {
      return "Svart nei.";
    }
    default: {
      return "Ikke svart.";
    }
  }
};

export const bareArbeidsgiversMotebehov = (motebehov) => {
  return motebehov.opprettetAv !== motebehov.aktorId;
};

export const setArbeidsgiverTekst = (leder, arbeidsgiverOnskerMote) => {
  const arbeidsgiverNavn = arbeidsgiverNavnEllerTomStreng(leder);
  const arbeidsgiverBedrift =
    leder && leder.organisasjonsnavn ? `${leder.organisasjonsnavn},` : "";
  return `<b>Arbeidsgiveren: </b> ${arbeidsgiverNavn} ${arbeidsgiverBedrift} ${setSvarTekst(
    arbeidsgiverOnskerMote
  )}`;
};

export const MotebehovKvitteringInnhold = ({
  deltakerOnskerMote,
  ikonAltTekst,
  motebehov,
  tekst,
}) => {
  const skalViseForklaring =
    motebehov && motebehov.motebehovSvar && motebehov.motebehovSvar.forklaring;
  return (
    <div className="motebehovKvitteringBoksInnhold">
      <div>
        <img
          className="svarstatus__ikon"
          src={setSvarIkon(deltakerOnskerMote)}
          alt={ikonAltTekst}
        />
        <span>{svarTidspunkt(motebehov)}</span>
      </div>
      <div>
        <span dangerouslySetInnerHTML={{ __html: tekst }} />
        {skalViseForklaring && <p>{motebehov.motebehovSvar.forklaring}</p>}
      </div>
    </div>
  );
};

MotebehovKvitteringInnhold.propTypes = {
  deltakerOnskerMote: PropTypes.bool,
  ikonAltTekst: PropTypes.string,
  motebehov: PropTypes.object,
  tekst: PropTypes.string,
};

export const MotebehovKvitteringInnholdArbeidstaker = ({
  arbeidstakersMotebehov,
  sykmeldt,
}) => {
  const arbeidstakerOnskerMote =
    arbeidstakersMotebehov && arbeidstakersMotebehov.motebehovSvar.harMotebehov;
  const arbeidstakerTekst = `<b>Den sykmeldte: </b> ${
    sykmeldt.navn
  } ${setSvarTekst(arbeidstakerOnskerMote)}`;
  const ikonAltTekst = `Sykmeldt ${ikonAlternativTekst(
    arbeidstakerOnskerMote
  )}`;

  return (
    <MotebehovKvitteringInnhold
      deltakerOnskerMote={arbeidstakerOnskerMote}
      ikonAltTekst={ikonAltTekst}
      motebehov={arbeidstakersMotebehov}
      tekst={arbeidstakerTekst}
    />
  );
};

MotebehovKvitteringInnholdArbeidstaker.propTypes = {
  arbeidstakersMotebehov: PropTypes.object,
  sykmeldt: PropTypes.object,
};

export const MotebehovKvitteringInnholdArbeidsgiver = ({
  motebehovListeMedBareArbeidsgiversMotebehov,
  ledereData,
}) => {
  return motebehovListeMedBareArbeidsgiversMotebehov.map((motebehov, index) => {
    const arbeidsgiverOnskerMote = motebehov.motebehovSvar.harMotebehov;
    const riktigLeder = lederMedGittAktorId(motebehov.opprettetAv, ledereData);
    const ikonAltTekst = `Arbeidsgiver ${arbeidsgiverNavnEllerTomStreng(
      riktigLeder
    )} ${ikonAlternativTekst(arbeidsgiverOnskerMote)}`;

    return (
      <MotebehovKvitteringInnhold
        key={index}
        deltakerOnskerMote={arbeidsgiverOnskerMote}
        ikonAltTekst={ikonAltTekst}
        motebehov={motebehov}
        tekst={setArbeidsgiverTekst(riktigLeder, arbeidsgiverOnskerMote)}
      />
    );
  });
};

MotebehovKvitteringInnholdArbeidsgiver.propTypes = {
  motebehovListeMedBareArbeidsgiversMotebehov: PropTypes.arrayOf(
    PropTypes.object
  ),
  ledereData: PropTypes.arrayOf(PropTypes.object),
};

export const MotebehovKvitteringInnholdArbeidsgiverUtenMotebehov = ({
  ledereUtenInnsendtMotebehov,
}) => {
  return ledereUtenInnsendtMotebehov.map((leder, index) => {
    const ikonAltTekst = `Arbeidsgiver ${arbeidsgiverNavnEllerTomStreng(
      leder
    )} ${ikonAlternativTekst(undefined)}`;
    return (
      <MotebehovKvitteringInnhold
        key={index}
        ikonAltTekst={ikonAltTekst}
        tekst={setArbeidsgiverTekst(leder)}
      />
    );
  });
};

MotebehovKvitteringInnholdArbeidsgiverUtenMotebehov.propTypes = {
  ledereUtenInnsendtMotebehov: PropTypes.array,
};

export const MotebehovKvittering = ({
  ledereData,
  ledereUtenInnsendtMotebehov,
  motebehovListe,
  sykmeldt,
}) => {
  return (
    <div className="panel motebehovKvitteringInnhold">
      <MotebehovKvitteringInnholdArbeidstaker
        arbeidstakersMotebehov={finnArbeidstakerMotebehovSvar(motebehovListe)}
        sykmeldt={sykmeldt}
      />
      <MotebehovKvitteringInnholdArbeidsgiver
        motebehovListeMedBareArbeidsgiversMotebehov={motebehovListe.filter(
          bareArbeidsgiversMotebehov
        )}
        ledereData={ledereData}
      />
      <MotebehovKvitteringInnholdArbeidsgiverUtenMotebehov
        ledereUtenInnsendtMotebehov={ledereUtenInnsendtMotebehov}
      />
    </div>
  );
};

MotebehovKvittering.propTypes = {
  ledereData: PropTypes.arrayOf(PropTypes.object),
  ledereUtenInnsendtMotebehov: PropTypes.arrayOf(PropTypes.object),
  motebehovListe: PropTypes.arrayOf(PropTypes.object),
  sykmeldt: PropTypes.object,
};
export default MotebehovKvittering;
