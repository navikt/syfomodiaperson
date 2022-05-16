import { mockFastlegerest } from "./fastlegerest/mockFastlegerest";
import { mockIsnarmesteleder } from "./isnarmesteleder/mockIsnarmesteleder";
import { mockIsoppfolgingstilfelle } from "./isoppfolgingstilfelle/mockIsoppfolgingstilfelle";
import { mockIspersonoppgave } from "./ispersonoppgave/mockIspersonoppgave";
import { mockModiacontextholder } from "./modiacontextholder/mockModiacontextholder";
import { mockSyfomoteadmin } from "./syfomoteadmin/mockSyfomoteadmin";
import { mockSyfomotebehov } from "./syfomotebehov/mockSyfomotebehov";
import { mockSyfooppfolgingsplanservice } from "./syfooppfolgingsplanservice/mockSyfooppfolgingsplanservice";
import { mockSykepengesoknadBackend } from "./sykepengesoknad/mockSykepengesoknadBackend";
import { mockSyfotilgangskontroll } from "./syfotilgangskontroll/mockSyfotilgangskontroll";
import { mockSyfobehandlendeenhet } from "./syfobehandlendeenhet/mockSyfobehandlendeenhet";
import { mockSyfoperson } from "./syfoperson/mockSyfoperson";
import { mockSyfosmregister } from "./syfosmregister/mockSyfosmregister";
import { mockIspengestopp } from "./ispengestopp/mockIspengestopp";
import { mockIsdialogmote } from "./isdialogmote/mockIsdialogmote";
import { mockIsdialogmotekandidat } from "./isdialogmotekandidat/mockIsdialogmotekandidat";
import { mockSyfoveileder } from "./syfoveileder/mockSyfoveileder";
import { mockUnleash } from "./unleash/mockUnleash";
import { mockIsdialogmelding } from "./isdialogmelding/mockIsdialogmelding";

const express = require("express");

const mockEndepunkter = (server) => {
  server.use(express.json());
  server.use(express.urlencoded());

  [
    mockFastlegerest,
    mockIsnarmesteleder,
    mockIsoppfolgingstilfelle,
    mockIspersonoppgave,
    mockModiacontextholder,
    mockSyfomoteadmin,
    mockSyfomotebehov,
    mockSyfooppfolgingsplanservice,
    mockSykepengesoknadBackend,
    mockSyfotilgangskontroll,
    mockSyfobehandlendeenhet,
    mockSyfoperson,
    mockSyfosmregister,
    mockIspengestopp,
    mockIsdialogmote,
    mockIsdialogmotekandidat,
    mockIsdialogmelding,
    mockSyfoveileder,
    mockUnleash,
  ].forEach((func) => {
    func(server);
  });
};

export default mockEndepunkter;
