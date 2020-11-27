import { PropTypes } from "prop-types";
import { ARBEIDSGIVER, BRUKER, NAV_VEILEDER } from "../konstanter";

export const motealternativPt = PropTypes.shape({
  id: PropTypes.number,
  tid: PropTypes.instanceOf(Date),
  created: PropTypes.instanceOf(Date),
  sted: PropTypes.string,
  valgt: PropTypes.bool,
});

export const motesvarPt = PropTypes.shape({
  id: PropTypes.number,
  tid: PropTypes.instanceOf(Date),
  created: PropTypes.instanceOf(Date),
  sted: PropTypes.string,
  valgt: PropTypes.bool,
});

export const motedeltakerPt = PropTypes.shape({
  navn: PropTypes.string,
  orgnummer: PropTypes.string,
  type: PropTypes.string,
  svar: PropTypes.arrayOf(motesvarPt),
  svartidspunkt: PropTypes.instanceOf(Date),
});

export const motePt = PropTypes.shape({
  moteUuid: PropTypes.string,
  status: PropTypes.string,
  fnr: PropTypes.string,
  opprettetTidspunkt: PropTypes.instanceOf(Date),
  bekreftetTidspunkt: PropTypes.instanceOf(Date),
  deltakere: PropTypes.arrayOf(motedeltakerPt),
  alternativer: PropTypes.arrayOf(motealternativPt),
});

export const motedeltakertypePt = PropTypes.oneOf([
  BRUKER,
  ARBEIDSGIVER,
  NAV_VEILEDER,
]);
