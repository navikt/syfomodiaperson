import { expect } from "chai";
import { shallow } from "enzyme";
import React from "react";
import BekreftetMotetidspunkt from "../../../src/mote/components/BekreftetMotetidspunkt";
import DatoOgTid from "../../../src/mote/components/DatoOgTid";

describe("BekreftetMotetidspunkt", () => {
  let ledetekster = {};
  let mote;
  let component;

  beforeEach(() => {
    process.env = {
      APP_ROOT: "/",
    };
    mote = {
      id: 0,
      moteUuid: "b06b5fc1-5d62-442a-8c16-5431259ea99b",
      opprettetAv: "Z990322",
      status: "BEKREFTET",
      opprettetTidspunkt: "2017-03-22T11:11:50.217Z",
      bekreftetTidspunkt: "2017-03-23T10:56:40Z",
      navEnhet: "navEnhet",
      deltakere: [
        {
          hendelser: [
            {
              kanal: "EPOST",
              adresse: "arbe.idsgiver@nav.no",
              varseltype: "OPPRETTET",
              resultat: "OK",
            },
            {
              kanal: "EPOST",
              adresse: "arbe.idsgiver@nav.no",
              varseltype: "BEKREFTET",
              resultat: "OK",
            },
          ],
          deltakerUuid: "68815365-28c4-452c-8bd7-2b2649ef2a68",
          navn: "Arbe Idsgiver",
          orgnummer: "012345678",
          epost: "arbe.idsgiver@nav.no",
          type: "arbeidsgiver",
          svartidspunkt: "2017-03-22T11:13:35.726Z",
          avvik: [],
          svar: [
            {
              id: 13947,
              tid: "2020-12-12T11:12:00Z",
              created: "2017-03-22T11:11:50.241Z",
              sted: "Oslo",
              valgt: true,
            },
            {
              id: 13948,
              tid: "2020-10-12T06:00:00Z",
              created: "2017-03-22T11:11:50.243Z",
              sted: "Oslo",
              valgt: true,
            },
          ],
        },
        {
          hendelser: [
            {
              kanal: "TLF",
              adresse: "+4799999999",
              varseltype: "OPPRETTET",
              resultat: "OK",
            },
            {
              kanal: "EPOST",
              adresse: "tester.scrambling-script@fellesregistre.no",
              varseltype: "OPPRETTET",
              resultat: "OK",
            },
            {
              kanal: "TLF",
              adresse: "+4799999999",
              varseltype: "BEKREFTET",
              resultat: "OK",
            },
            {
              kanal: "EPOST",
              adresse: "tester.scrambling-script@fellesregistre.no",
              varseltype: "BEKREFTET",
              resultat: "OK",
            },
          ],
          deltakerUuid: "b3579888-fa3f-44bf-89b8-9ad4cb3997fe",
          navn: "Andreas Arbeidstaker",
          fnr: "77665544332",
          type: "Bruker",
          avvik: [],
          svar: [
            {
              id: 13947,
              tid: "2020-12-12T11:12:00Z",
              created: "2017-03-22T11:11:50.241Z",
              sted: "Oslo",
              valgt: false,
            },
            {
              id: 13948,
              tid: "2020-10-12T06:00:00Z",
              created: "2017-03-22T11:11:50.243Z",
              sted: "Oslo",
              valgt: false,
            },
          ],
        },
      ],
      bekreftetAlternativ: {
        id: 13947,
        tid: "2020-12-12T11:12:00Z",
        created: "2017-03-22T11:11:50.241Z",
        sted: "Oslo",
        valgt: false,
      },
      alternativer: [
        {
          id: 13947,
          tid: "2020-12-12T11:12:00Z",
          created: "2017-03-22T11:11:50.241Z",
          sted: "Oslo",
          valgt: true,
        },
        {
          id: 13948,
          tid: "2020-10-12T06:00:00Z",
          created: "2017-03-22T11:11:50.243Z",
          sted: "Oslo",
          valgt: false,
        },
      ],
    };

    ledetekster = {
      "mote.bookingstatus.bekreftet.sendt": "Bekreftet møtetidspunkt",
      "mote.bookingstatus.bekreftet.sendt-dato":
        "Møtetidspunkt valgt, møteresultat og varsel er sendt til partene %DATO%",
    };

    component = shallow(
      <BekreftetMotetidspunkt ledetekster={ledetekster} mote={mote} />
    );
  });

  it("Skal inneholde det bekreftede tidspunktet", () => {
    expect(component.find(DatoOgTid).prop("tid")).to.deep.equal(
      mote.bekreftetAlternativ.tid
    );
  });
});
