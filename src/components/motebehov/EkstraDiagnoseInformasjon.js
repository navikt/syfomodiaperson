import React from "react";
import PropTypes from "prop-types";
import { Checkbox } from "nav-frontend-skjema";
import { erEkstraDiagnoseInformasjon } from "../../utils/sykmeldinger/sykmeldingUtils";
import { tilDatoMedUkedagOgManedNavn } from "../../utils/datoUtils";

const tekster = {
  ekstraDiagnoseInformasjon: {
    fravaersgrunnLovfestet: {
      lovfestetGrunn: "Annen lovfestet fraværsgrunn",
      beskrivFravaeret: "Beskriv fraværet",
    },
    yrkesskade: {
      kanSkyldesYrkesskade:
        "Sykmeldingen kan skyldes en yrkesskade/yrkessykdom",
      skadedato: "Skadedato",
    },
    svangerskap: {
      svangerskapsrelatert: "Sykdommen er svangerskapsrelatert",
    },
  },
};

const AnnenLovfestetFravaersgrunn = ({ diagnose }) => {
  return (
    <div className="annenLovfestetFravaersgrunn">
      <h6 className="sporsmal">
        {
          tekster.ekstraDiagnoseInformasjon.fravaersgrunnLovfestet
            .lovfestetGrunn
        }
      </h6>
      <p>{diagnose.fravaersgrunnLovfestet}</p>
      {diagnose.fravaerBeskrivelse && [
        <h6 key={0} className="sporsmal">
          {
            tekster.ekstraDiagnoseInformasjon.fravaersgrunnLovfestet
              .beskrivFravaeret
          }
        </h6>,
        <p key={1} className="annenLovfestetFravaersgrunnBeskrivelse">
          {diagnose.fravaerBeskrivelse}
        </p>,
      ]}
    </div>
  );
};

AnnenLovfestetFravaersgrunn.propTypes = {
  diagnose: PropTypes.object,
};

const Yrkesskade = ({ diagnose }) => {
  return (
    <div className="yrkesskade">
      <Checkbox
        className="sykmeldingMotebehovVisning__checkbox"
        label={
          tekster.ekstraDiagnoseInformasjon.yrkesskade.kanSkyldesYrkesskade
        }
        checked
        disabled
      />
      {diagnose.yrkesskadeDato && [
        <h6 key={0} className="sporsmal">
          {tekster.ekstraDiagnoseInformasjon.yrkesskade.skadedato}
        </h6>,
        <p key={1} className="yrkesskadeDato">
          {tilDatoMedUkedagOgManedNavn(diagnose.yrkesskadeDato)}
        </p>,
      ]}
    </div>
  );
};

Yrkesskade.propTypes = {
  diagnose: PropTypes.object,
};

export const EkstraDiagnoseInformasjon = ({ sykmelding }) => {
  const diagnose = sykmelding.diagnose;
  const skalVise = erEkstraDiagnoseInformasjon(sykmelding);
  return (
    skalVise && (
      <div className="sykmeldingMotebehovVisning__avsnitt">
        {diagnose.fravaersgrunnLovfestet && (
          <AnnenLovfestetFravaersgrunn diagnose={diagnose} />
        )}

        {diagnose.svangerskap && (
          <Checkbox
            className="sykmeldingMotebehovVisning__checkbox"
            label={
              tekster.ekstraDiagnoseInformasjon.svangerskap.svangerskapsrelatert
            }
            checked
            disabled
          />
        )}

        {diagnose.yrkesskade && <Yrkesskade diagnose={diagnose} />}
      </div>
    )
  );
};

EkstraDiagnoseInformasjon.propTypes = {
  sykmelding: PropTypes.object,
};

export default EkstraDiagnoseInformasjon;
