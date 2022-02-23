import { moterMock } from "./data/moterMock";
import { motebehovMock } from "./data/motebehovMock";
import { brukerinfoMock } from "./data/brukerinfoMock";
import { historikkmotebehovMock } from "./data/historikkmotebehovMock";
import { historikkmoterMock } from "./data/historikkmoterMock";
import { historikkoppfolgingsplanMock } from "./data/historikkoppfolgingsplanMock";
import { ledereMock } from "./data/ledereMock";
import { dialogmoterMock } from "./data/dialogmoterMock";
import { soknaderMock } from "./data/soknaderMock";
import { sykmeldingerMock } from "./data/sykmeldingerMock";
import { tilgangBrukerMock } from "./data/tilgangtilbrukerMock";
import { virksomhetMock } from "./data/virksomhetMock";

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
