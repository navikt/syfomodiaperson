import { virksomhetMock } from "../data/virksomhetMock";
import { moterMock } from "../data/moterMock";
import { historikkmoterMock } from "../data/historikkmoterMock";
import { ledereMock } from "../data/ledereMock";
import { SYFOMOTEADMIN_ROOT } from "../../src/apiConstants";
import {
  ARBEIDSTAKER_DEFAULT,
  ARBEIDSTAKER_DEFAULT_FULL_NAME,
  VEILEDER_IDENT_DEFAULT,
} from "../common/mockConstants";

const Auth = require("../../server/auth/index.js");

const mockOpprettetIdResultat = () => {
  mockOpprettetIdResultat.rollingCounter += 1;
};
mockOpprettetIdResultat.rollingCounter = 100;

const mockMoteAlternativer = (alternativer) => {
  return alternativer.map((alternativ) => {
    return {
      id: (mockOpprettetIdResultat.rollingCounter += 1),
      tid: alternativ.tid,
      created: new Date().toString(),
      sted: alternativ.sted,
      valgt: false,
    };
  });
};

const mockMoteDeltakere = (alternativer, orgnummer) => {
  const leder = ledereMock.find((leder) => {
    return leder.virksomhetsnummer === orgnummer;
  });

  return [
    {
      deltakerUuid: "66f1d827-94db-43d4-b6de-2f7902e76bf8",
      navn: ARBEIDSTAKER_DEFAULT_FULL_NAME,
      fnr: ARBEIDSTAKER_DEFAULT.personIdent,
      orgnummer: orgnummer,
      epost: ARBEIDSTAKER_DEFAULT.epost,
      type: "Bruker",
      svartidspunkt: null,
      svar: alternativer,
    },
    {
      deltakerUuid: "198a6dbf-c987-4b57-a401-a3915ec11424",
      navn: leder!!.narmesteLederNavn,
      fnr: "12345678913",
      orgnummer: orgnummer,
      epost: leder!!.narmesteLederEpost,
      type: "arbeidsgiver",
      svartidspunkt: null,
      svar: alternativer,
    },
  ];
};

const mockForLokal = (server) => {
  server.get(
    `${SYFOMOTEADMIN_ROOT}/moter`,
    Auth.ensureAuthenticated(),
    (req, res) => {
      res.setHeader("Content-Type", "application/json");
      res.send(JSON.stringify(moterMock));
    }
  );

  server.get(
    `${SYFOMOTEADMIN_ROOT}/historikk`,
    Auth.ensureAuthenticated(),
    (req, res) => {
      res.setHeader("Content-Type", "application/json");
      res.send(JSON.stringify(historikkmoterMock));
    }
  );

  server.get(
    `${SYFOMOTEADMIN_ROOT}/virksomhet/:virksomhetsnummer`,
    Auth.ensureAuthenticated(),
    (req, res) => {
      res.setHeader("Content-Type", "application/json");
      res.send(JSON.stringify(virksomhetMock(req.params.virksomhetsnummer)));
    }
  );
};

const mockEndepunkterSomEndrerState = (server) => {
  server.post(
    `${SYFOMOTEADMIN_ROOT}/moter/:uuid/avbryt`,
    Auth.ensureAuthenticated(),
    (req, res) => {
      const { uuid } = req.params;
      const oppdaterteMoter = moterMock.map((mote) => {
        if (mote.moteUuid.toString() === uuid.toString()) {
          mote.status = "AVBRUTT";
        }
      });
      Object.assign(moterMock, ...oppdaterteMoter);

      res.setHeader("Content-Type", "application/json");
      res.send(JSON.stringify({}));
    }
  );

  server.post(
    `${SYFOMOTEADMIN_ROOT}/moter/:uuid/bekreft`,
    Auth.ensureAuthenticated(),
    (req, res) => {
      const { valgtAlternativId } = req.query;
      const { uuid } = req.params;
      const oppdaterteMoter = moterMock.map((mote) => {
        if (mote.moteUuid.toString() === uuid.toString()) {
          mote.status = "BEKREFTET";
          const alternativ = mote.alternativer.find((alternativ) => {
            return alternativ.id.toString() === valgtAlternativId.toString();
          });
          if (alternativ) {
            mote.bekreftetAlternativ = alternativ;
          }
        }
      });
      Object.assign(moterMock, ...oppdaterteMoter);

      res.setHeader("Content-Type", "application/json");
      res.send(JSON.stringify({}));
    }
  );

  server.post(
    `${SYFOMOTEADMIN_ROOT}/moter/:uuid/nyealternativer`,
    (req, res) => {
      res.json({ requestBody: req.body });

      const reqBody = req.body;
      const { uuid } = req.params;

      const nyeAlternativer = mockMoteAlternativer(reqBody);
      const oppdaterteMoter = moterMock.map((mote) => {
        if (mote.moteUuid.toString() === uuid.toString()) {
          mote.alternativer = [...mote.alternativer, ...nyeAlternativer];
          mote.deltakere.map((deltaker) => {
            deltaker.svar = [...deltaker.svar, ...nyeAlternativer];
          });
          mote.sistEndret = new Date().toString();
        }
      });
      Object.assign(moterMock, ...oppdaterteMoter);

      res.setHeader("Content-Type", "application/json");
      res.send(JSON.stringify({}));
    }
  );

  server.post(`${SYFOMOTEADMIN_ROOT}/moter`, (req, res) => {
    res.json({ requestBody: req.body });

    const reqBody = req.body;

    const alternativer = mockMoteAlternativer(reqBody.alternativer);
    const deltakere = mockMoteDeltakere(alternativer, reqBody.orgnummer);

    const nyttMote = {
      id: (mockOpprettetIdResultat.rollingCounter += 1),
      moteUuid: `${mockOpprettetIdResultat.rollingCounter}-abc`,
      opprettetAv: VEILEDER_IDENT_DEFAULT,
      aktorId: "1",
      status: "OPPRETTET",
      fnr: reqBody.fnr,
      opprettetTidspunkt: new Date().toDateString(),
      bekreftetTidspunkt: null,
      navEnhet: reqBody.navEnhet,
      eier: VEILEDER_IDENT_DEFAULT,
      deltakere: deltakere,
      bekreftetAlternativ: null,
      alternativer: alternativer,
      sistEndret: new Date().toString(),
    };

    moterMock.push(nyttMote);

    res.setHeader("Content-Type", "application/json");
    res.send(JSON.stringify({}));
  });
};

export const mockSyfomoteadmin = (server) => {
  mockForLokal(server);
  mockEndepunkterSomEndrerState(server);
};
