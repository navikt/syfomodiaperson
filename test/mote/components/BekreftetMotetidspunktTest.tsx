import { expect } from "chai";
import React from "react";
import BekreftetMotetidspunkt from "../../../src/components/mote/components/BekreftetMotetidspunkt";
import { render, screen } from "@testing-library/react";
import { MotedeltakerType, MoteDTO } from "@/data/mote/types/moteTypes";
import {
  toDate,
  toDateWithoutNullCheck,
  visDato,
  visKlokkeslett,
} from "@/utils/datoUtils";

const mote: MoteDTO = {
  aktorId: "",
  eier: "",
  sistEndret: toDateWithoutNullCheck("2017-03-23T10:56:40Z"),
  trengerBehandling: false,
  moteUuid: "b06b5fc1-5d62-442a-8c16-5431259ea99b",
  opprettetAv: "Z990322",
  status: "BEKREFTET",
  opprettetTidspunkt: toDateWithoutNullCheck("2017-03-22T11:11:50.217Z"),
  bekreftetTidspunkt: toDate("2017-03-23T10:56:40Z"),
  navEnhet: "navEnhet",
  deltakere: [
    {
      navn: "Arbe Idsgiver",
      orgnummer: "012345678",
      type: MotedeltakerType.ARBEIDSGIVER,
      svartidspunkt: toDateWithoutNullCheck("2017-03-22T11:13:35.726Z"),
      svar: [
        {
          id: 13947,
          tid: toDateWithoutNullCheck("2020-12-12T11:12:00Z"),
          created: toDateWithoutNullCheck("2017-03-22T11:11:50.241Z"),
          sted: "Oslo",
          valgt: true,
        },
        {
          id: 13948,
          tid: toDateWithoutNullCheck("2020-10-12T06:00:00Z"),
          created: toDateWithoutNullCheck("2017-03-22T11:11:50.243Z"),
          sted: "Oslo",
          valgt: true,
        },
      ],
    },
    {
      navn: "Andreas Arbeidstaker",
      type: MotedeltakerType.BRUKER,
      orgnummer: "",
      svartidspunkt: toDateWithoutNullCheck("2017-03-22T11:11:50.241Z"),
      svar: [
        {
          id: 13947,
          tid: toDateWithoutNullCheck("2020-12-12T11:12:00Z"),
          created: toDateWithoutNullCheck("2017-03-22T11:11:50.241Z"),
          sted: "Oslo",
          valgt: false,
        },
        {
          id: 13948,
          tid: toDateWithoutNullCheck("2020-10-12T06:00:00Z"),
          created: toDateWithoutNullCheck("2017-03-22T11:11:50.243Z"),
          sted: "Oslo",
          valgt: false,
        },
      ],
    },
  ],
  bekreftetAlternativ: {
    id: 13947,
    tid: toDateWithoutNullCheck("2020-12-12T11:12:00Z"),
    created: toDateWithoutNullCheck("2017-03-22T11:11:50.241Z"),
    sted: "Oslo",
    valgt: false,
  },
  alternativer: [
    {
      id: 13947,
      tid: toDateWithoutNullCheck("2020-12-12T11:12:00Z"),
      created: toDateWithoutNullCheck("2017-03-22T11:11:50.241Z"),
      sted: "Oslo",
      valgt: true,
    },
    {
      id: 13948,
      tid: toDateWithoutNullCheck("2020-10-12T06:00:00Z"),
      created: toDateWithoutNullCheck("2017-03-22T11:11:50.243Z"),
      sted: "Oslo",
      valgt: false,
    },
  ],
};

describe("BekreftetMotetidspunkt", () => {
  it("Skal inneholde det bekreftede tidspunktet", () => {
    render(<BekreftetMotetidspunkt mote={mote} />);

    const expectedDato = visDato(mote.bekreftetAlternativ?.tid);
    const expectedKlokkeslett =
      visKlokkeslett(mote.bekreftetAlternativ?.tid) ?? "Mangler tid ";
    expect(screen.getByText(expectedDato)).to.exist;
    expect(screen.getByText(`kl. ${expectedKlokkeslett}`)).to.exist;
  });
});
