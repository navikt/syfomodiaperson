import { moterMock } from "./syfomoteadmin/moterMock";
import { motebehovMock } from "./syfomotebehov/motebehovMock";
import { brukerinfoMock } from "./syfoperson/brukerinfoMock";
import { historikkmotebehovMock } from "./syfomotebehov/historikkmotebehovMock";
import { historikkmoterMock } from "./syfomoteadmin/historikkmoterMock";
import { historikkoppfolgingsplanMock } from "./syfooppfolgingsplanservice/historikkoppfolgingsplanMock";
import { ledereMock } from "./isnarmesteleder/ledereMock";
import { dialogmoterMock } from "./isdialogmote/dialogmoterMock";
import { soknaderMock } from "./sykepengesoknad/soknaderMock";
import { sykmeldingerMock } from "./syfosmregister/sykmeldingerMock";
import { tilgangBrukerMock } from "./syfotilgangskontroll/tilgangtilbrukerMock";
import { virksomhetMock } from "./syfomoteadmin/virksomhetMock";

export const mockData = {
  moterMock,
  motebehovMock,
  brukerinfoMock,
  historikkmotebehovMock,
  historikkmoterMock,
  historikkoppfolgingsplanMock,
  ledereMock,
  dialogmoterMock,
  soknaderMock,
  sykmeldingerMock,
  tilgangBrukerMock,
  virksomhetMock: virksomhetMock(),
};
