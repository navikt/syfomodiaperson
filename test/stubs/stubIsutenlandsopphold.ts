import { ISUTENLANDSOPPHOLD_ROOT } from "@/apiConstants";
import { mockServer } from "../setup";
import { http, HttpResponse } from "msw";
import {
  SoknadDTO,
  SoknaderResponseDTO,
  SoknadHenleggelsePostDTO,
  SoknadIkkeAktuellPostDTO,
  SoknadVedtakPostDTO,
} from "@/data/utenlandsopphold/utenlandsoppholdTypes";
import { VEILEDER_DEFAULT } from "@/mocks/common/mockConstants";
import {
  byggOppdatertSoknadMedHenleggelse,
  byggOppdatertSoknadMedIkkeAktuell,
  byggOppdatertSoknadMedVedtak,
} from "@/mocks/isutenlandsopphold/mockIsutenlandsopphold";

export const stubSoknaderQuery = (response: SoknaderResponseDTO) =>
  mockServer.use(
    http.post(`*${ISUTENLANDSOPPHOLD_ROOT}/soknader/query`, () =>
      HttpResponse.json(response),
    ),
  );

/**
 * Stubber både henting og innsending av søknader med en delt, muterbar tilstand,
 * slik at et evt. refetch av søknadslisten etter en behandling reflekterer
 * den oppdaterte statusen, i stedet for alltid å returnere den opprinnelige mocken.
 */
export const stubSoknaderMedMuterbarTilstand = (soknader: SoknadDTO[]) => {
  let tilstand = soknader;

  const finnSoknad = (soknadId: string) =>
    tilstand.find((soknad) => soknad.soknadId === soknadId);

  const oppdaterTilstand = (soknadId: string, nySoknad: SoknadDTO) => {
    tilstand = tilstand.map((soknad) =>
      soknad.soknadId === soknadId ? nySoknad : soknad,
    );
  };

  mockServer.use(
    http.post(`*${ISUTENLANDSOPPHOLD_ROOT}/soknader/query`, () =>
      HttpResponse.json({ soknader: tilstand }),
    ),
    http.post<{ soknadId: string }, SoknadVedtakPostDTO>(
      `*${ISUTENLANDSOPPHOLD_ROOT}/soknader/:soknadId/vedtak`,
      async ({ request, params }) => {
        const vedtak = await request.json();
        const soknadId = params.soknadId;
        const oppdatertSoknad = finnSoknad(soknadId);

        if (!oppdatertSoknad) {
          return HttpResponse.text(
            `Did not find soknad with uuid ${soknadId}`,
            { status: 400 },
          );
        }

        const nySoknad = byggOppdatertSoknadMedVedtak(
          oppdatertSoknad,
          vedtak,
          VEILEDER_DEFAULT.ident,
        );
        oppdaterTilstand(soknadId, nySoknad);

        return HttpResponse.json({ soknad: nySoknad });
      },
    ),
    http.post<{ soknadId: string }, SoknadHenleggelsePostDTO>(
      `*${ISUTENLANDSOPPHOLD_ROOT}/soknader/:soknadId/henleggelse`,
      async ({ request, params }) => {
        const henleggelse = await request.json();
        const soknadId = params.soknadId;
        const oppdatertSoknad = finnSoknad(soknadId);

        if (!oppdatertSoknad) {
          return HttpResponse.text(
            `Did not find soknad with uuid ${soknadId}`,
            { status: 400 },
          );
        }

        const nySoknad = byggOppdatertSoknadMedHenleggelse(
          oppdatertSoknad,
          henleggelse,
          VEILEDER_DEFAULT.ident,
        );
        oppdaterTilstand(soknadId, nySoknad);

        return HttpResponse.json({ soknad: nySoknad });
      },
    ),
    http.post<{ soknadId: string }, SoknadIkkeAktuellPostDTO>(
      `*${ISUTENLANDSOPPHOLD_ROOT}/soknader/:soknadId/ikke-aktuell`,
      async ({ request, params }) => {
        const ikkeAktuell = await request.json();
        const soknadId = params.soknadId;
        const oppdatertSoknad = finnSoknad(soknadId);

        if (!oppdatertSoknad) {
          return HttpResponse.text(
            `Did not find soknad with uuid ${soknadId}`,
            { status: 400 },
          );
        }

        const nySoknad = byggOppdatertSoknadMedIkkeAktuell(
          oppdatertSoknad,
          ikkeAktuell,
          VEILEDER_DEFAULT.ident,
        );
        oppdaterTilstand(soknadId, nySoknad);

        return HttpResponse.json({ soknad: nySoknad });
      },
    ),
  );
};
