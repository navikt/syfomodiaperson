import {
  ARBEIDSTAKER_DEFAULT,
  VIRKSOMHET_PONTYPANDY,
} from "../common/mockConstants";

export const oppfolgingstilfellePersonMock = {
  oppfolgingstilfelleList: [
    {
      arbeidstakerAtTilfelleEnd: true,
      start: "2020-02-21",
      end: "2030-12-10",
      virksomhetsnummerList: [
        VIRKSOMHET_PONTYPANDY.virksomhetsnummer,
        "333666999",
        "912345678",
        "000999000",
      ],
    },
    {
      arbeidstakerAtTilfelleEnd: false,
      start: "2019-06-06",
      end: "2020-01-21",
      virksomhetsnummerList: [VIRKSOMHET_PONTYPANDY.virksomhetsnummer],
    },
  ],
  personIdent: ARBEIDSTAKER_DEFAULT.personIdent,
};
