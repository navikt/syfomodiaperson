import { ISPERSONOPPGAVE_ROOT } from "@/apiConstants";

import {
  makePersonOppgaveBehandlet,
  personoppgaverMock,
} from "./personoppgaveMock";
import { BehandlePersonoppgaveRequestDTO } from "@/data/personoppgave/types/BehandlePersonoppgaveRequestDTO";
import { http, HttpResponse } from "msw";

let personOppgaver = personoppgaverMock();

export const mockIspersonoppgave = [
  http.get(`${ISPERSONOPPGAVE_ROOT}/personoppgave/personident`, () => {
    return HttpResponse.json(personOppgaver);
  }),

  http.post<{ uuid: string }>(
    `${ISPERSONOPPGAVE_ROOT}/personoppgave/:uuid/behandle`,
    ({ params }) => {
      const { uuid } = params;
      const gjeldendeOppgave = personOppgaver.find(
        (oppgave) => oppgave.uuid === uuid
      );
      if (!!gjeldendeOppgave) {
        personOppgaver = [
          makePersonOppgaveBehandlet(gjeldendeOppgave),
          ...personOppgaver.filter((oppgave) => oppgave.uuid !== uuid),
        ];
      }
      return new HttpResponse(null, { status: 200 });
    }
  ),

  http.post<object, BehandlePersonoppgaveRequestDTO>(
    `${ISPERSONOPPGAVE_ROOT}/personoppgave/behandle`,
    async ({ request }) => {
      const body = await request.json();
      const oppgaverForType = personOppgaver.filter(
        (oppgave) => oppgave.type === body.personOppgaveType
      );
      const behandledeOppgaver = oppgaverForType.map((oppgave) =>
        makePersonOppgaveBehandlet(oppgave)
      );
      const behandledeOppgaverUuid = behandledeOppgaver.map(
        (oppgave) => oppgave.uuid
      );
      personOppgaver = [
        ...behandledeOppgaver,
        ...personOppgaver.filter(
          (oppgave) => !behandledeOppgaverUuid.includes(oppgave.uuid)
        ),
      ];
      return new HttpResponse(null, { status: 200 });
    }
  ),
];
