import React from "react";
import {
  keyValue,
  getLedetekst,
  getSykmeldingOpplysning,
  tilLesbarDatoMedArstall,
  sykmelding as sykmeldingPt,
} from "@navikt/digisyfo-npm";
import MulighetForArbeid from "./MulighetForArbeid";
import Friskmelding from "./Friskmelding";
import UtdypendeOpplysninger from "./UtdypendeOpplysninger";
import BedreArbeidsevne from "./BedreArbeidsevne";
import MeldingTilNAV from "./MeldingTilNAV";
import Tilbakedatering from "./Tilbakedatering";
import MeldingTilArbeidsgiver from "./MeldingTilArbeidsgiver";
import AndreSykmeldingOpplysninger from "./AndreSykmeldingOpplysninger";

const FlereOpplysninger = ({ sykmelding, ledetekster }) => {
  return (
    <div>
      <div className="sykmeldingSeksjon">
        {getSykmeldingOpplysning(
          sykmelding.bekreftelse,
          "utstedelsesdato",
          getLedetekst("din-sykmelding.annet.utstedelsesdato", ledetekster),
          tilLesbarDatoMedArstall(sykmelding.bekreftelse.utstedelsesdato),
          "h4"
        )}
        {getSykmeldingOpplysning(
          sykmelding,
          "startLegemeldtFravaer",
          getLedetekst(
            "din-sykmelding.mulighet.for.arbeid.start.legemeldt.fravaer.tittel",
            ledetekster
          ),
          tilLesbarDatoMedArstall(sykmelding.startLegemeldtFravaer),
          "h4"
        )}
      </div>
      <MulighetForArbeid sykmelding={sykmelding} ledetekster={ledetekster} />
      <Friskmelding sykmelding={sykmelding} ledetekster={ledetekster} />
      <UtdypendeOpplysninger
        sykmelding={sykmelding}
        ledetekster={ledetekster}
      />
      <BedreArbeidsevne sykmelding={sykmelding} ledetekster={ledetekster} />
      <MeldingTilNAV sykmelding={sykmelding} ledetekster={ledetekster} />
      <MeldingTilArbeidsgiver
        sykmelding={sykmelding}
        ledetekster={ledetekster}
      />
      <Tilbakedatering sykmelding={sykmelding} ledetekster={ledetekster} />
      <AndreSykmeldingOpplysninger
        sykmelding={sykmelding}
        ledetekster={ledetekster}
      />
    </div>
  );
};

FlereOpplysninger.propTypes = {
  sykmelding: sykmeldingPt,
  ledetekster: keyValue,
};

export default FlereOpplysninger;
