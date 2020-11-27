import PropTypes from "prop-types";
import { sykepengesoknad } from "@navikt/digisyfo-npm";
import * as soknadtyper from "../enums/soknadtyper";
import * as soknadstatuser from "../enums/soknadstatuser";
import * as arbeidssituasjoner from "../enums/arbeidssituasjoner";
import * as svartyper from "../enums/svartyper";

export { sykepengesoknad, sykmelding } from "@navikt/digisyfo-npm";

export * from "./moteProptypes";

export const arbeidssituasjon = PropTypes.oneOf([
  arbeidssituasjoner.ARBEIDSTAKER,
  arbeidssituasjoner.NAERINGSDRIVENDE,
  arbeidssituasjoner.FRILANSER,
  arbeidssituasjoner.ARBEIDSLEDIG,
  arbeidssituasjoner.ANNET,
]);

export const brodsmule = PropTypes.shape({
  sti: PropTypes.string,
  tittel: PropTypes.string,
  sisteSmule: PropTypes.bool,
  erKlikkbar: PropTypes.bool,
});

export const naermesteLeder = PropTypes.shape({
  navn: PropTypes.string,
  epost: PropTypes.string,
  mobil: PropTypes.string,
  orgnummer: PropTypes.string,
  organisasjonsnavn: PropTypes.string,
  aktivTom: PropTypes.string,
});

export const arbeidsgiver = PropTypes.shape({
  navn: PropTypes.string,
  orgnummer: PropTypes.string,
  naermesteLeder,
});

export const svartypePt = PropTypes.oneOf(Object.values(svartyper));

export const svar = PropTypes.arrayOf(
  PropTypes.shape({
    verdi: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
  })
);

const sporsmalShape = {
  id: PropTypes.string,
  kriterieForVisningAvUndersporsmal: PropTypes.string,
  max: PropTypes.oneOfType([
    PropTypes.instanceOf(Date),
    PropTypes.number,
    PropTypes.string,
  ]),
  min: PropTypes.oneOfType([
    PropTypes.instanceOf(Date),
    PropTypes.number,
    PropTypes.string,
  ]),
  sporsmalstekst: PropTypes.string,
  svar,
  svartype: svartypePt,
  tag: PropTypes.string,
  undertekst: PropTypes.string,
  pavirkerAndreSporsmal: PropTypes.bool,
};

sporsmalShape.undersporsmal = PropTypes.arrayOf(PropTypes.shape(sporsmalShape));

export const sporsmal = PropTypes.shape(sporsmalShape);

export const soknad = PropTypes.shape({
  id: PropTypes.string,
  sykmeldingId: PropTypes.string,
  soknadstype: PropTypes.oneOf(Object.values(soknadtyper)),
  status: PropTypes.oneOf(Object.values(soknadstatuser)),
  fom: PropTypes.instanceOf(Date),
  tom: PropTypes.instanceOf(Date),
  opprettetDato: PropTypes.instanceOf(Date),
  innsendtDato: PropTypes.instanceOf(Date),
  sendtTilNAVDato: PropTypes.instanceOf(Date),
  sendtTilArbeidsgiverDato: PropTypes.instanceOf(Date),
  sporsmal: PropTypes.arrayOf(sporsmal),
  korrigerer: PropTypes.string,
  korrigertAv: PropTypes.string,
  arbeidsgiver: PropTypes.shape({
    navn: PropTypes.string,
    orgnummer: PropTypes.string,
  }),
});

export const oppsummeringSporsmal = {
  svar,
  sporsmalstekst: PropTypes.string,
  tag: PropTypes.string,
};

export const soknadEllerSykepengesoknad = PropTypes.oneOfType([
  soknad,
  sykepengesoknad,
]);
