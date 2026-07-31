import { ISUTENLANDSOPPHOLD_ROOT } from "@/apiConstants";
import { mockServer } from "../setup";
import { http, HttpResponse } from "msw";
import {
  SoknadDTO,
  SoknaderResponseDTO,
  SoknadVedtakPostDTO,
} from "@/data/utenlandsopphold/utenlandsoppholdTypes";
import { VEILEDER_DEFAULT } from "@/mocks/common/mockConstants";
import { byggOppdatertSoknadMedVedtak } from "@/mocks/isutenlandsopphold/mockIsutenlandsopphold";

export const stubSoknaderQuery = (response: SoknaderResponseDTO) =>
  mockServer.use(
    http.post(`*${ISUTENLANDSOPPHOLD_ROOT}/soknader/query`, () =>
      HttpResponse.json(response),
    ),
  );

/**
 * Stubber både henting og innsending av søknader med en delt, muterbar tilstand,
 * slik at et evt. refetch av søknadslisten etter et fattet vedtak reflekterer
 * den oppdaterte statusen, i stedet for alltid å returnere den opprinnelige mocken.
 */
export const stubSoknaderMedMuterbarTilstand = (soknader: SoknadDTO[]) => {
  let tilstand = soknader;

  mockServer.use(
    http.post(`*${ISUTENLANDSOPPHOLD_ROOT}/soknader/query`, () =>
      HttpResponse.json({ soknader: tilstand }),
    ),
    http.post<{ soknadId: string }, SoknadVedtakPostDTO>(
      `*${ISUTENLANDSOPPHOLD_ROOT}/soknader/:soknadId/vedtak`,
      async ({ request, params }) => {
        const vedtak = await request.json();
        const soknadId = params.soknadId;
        const oppdatertSoknad = tilstand.find(
          (soknad) => soknad.soknadId === soknadId,
        );

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
        tilstand = tilstand.map((soknad) =>
          soknad.soknadId === soknadId ? nySoknad : soknad,
        );

        return HttpResponse.json({ soknad: nySoknad });
      },
    ),
  );
};
