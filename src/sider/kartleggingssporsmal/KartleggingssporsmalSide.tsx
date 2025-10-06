import React, { ReactElement } from "react";
import Side from "@/components/side/Side";
import Sidetopp from "@/components/side/Sidetopp";
import { Menypunkter } from "@/components/globalnavigasjon/GlobalNavigasjon";
import { Box, Button, VStack } from "@navikt/ds-react";
import * as Tredelt from "@/components/side/TredeltSide";
import KartleggingssporsmalKandidat from "@/sider/kartleggingssporsmal/KartleggingssporsmalKandidat";
import SideLaster from "@/components/side/SideLaster";
import {
  hasReceivedQuestions,
  isKandidat,
} from "@/data/kartleggingssporsmal/kartleggingssporsmalTypes";
import KartleggingssporsmalSvar from "@/sider/kartleggingssporsmal/KartleggingssporsmalSvar";
import {
  useKartleggingssporsmalKandidatQuery,
  useKartleggingssporsmalSvarQuery,
} from "@/data/kartleggingssporsmal/kartleggingssporsmalQueryHooks";

const texts = {
  title: "Kartleggingsspørsmål",
  vurdereOppgaveText: "Behovet er vurdert, fjern oppgaven",
  extraInfo: "Informasjon om hva som skal gjøres ved vurdering",
};

export default function KartleggingssporsmalSide(): ReactElement {
  const getKandidat = useKartleggingssporsmalKandidatQuery();
  const getKartleggingssporsmalSvar = useKartleggingssporsmalSvarQuery(
    isKandidat(getKandidat.data) && hasReceivedQuestions(getKandidat.data)
  );
  const kartleggingsvar = getKartleggingssporsmalSvar.data;

  const isLoading =
    getKandidat.isLoading || getKartleggingssporsmalSvar.isLoading;
  const isError = getKandidat.isError || getKartleggingssporsmalSvar.isError;

  return (
    <Side
      tittel={texts.title}
      aktivtMenypunkt={Menypunkter.KARTLEGGINGSSPORSMAL}
    >
      <Sidetopp tittel={texts.title} />
      <SideLaster henter={isLoading} hentingFeilet={isError}>
        <Tredelt.Container>
          <Tredelt.FirstColumn className="-xl:mb-2">
            <Box background="surface-default" className="p-6 gap-6">
              <KartleggingssporsmalKandidat kandidat={getKandidat.data} />
              {kartleggingsvar && kartleggingsvar.formResponse !== null && (
                <>
                  <VStack gap="4">
                    <KartleggingssporsmalSvar
                      kartleggingssporsmalSvar={kartleggingsvar.formResponse}
                    />
                  </VStack>
                  <Button variant="primary" size="small" className="mt-4">
                    {texts.vurdereOppgaveText}
                  </Button>
                </>
              )}
            </Box>
          </Tredelt.FirstColumn>
          <Tredelt.SecondColumn>
            <Box background="surface-default" padding="6" className="mb-2">
              {texts.extraInfo}
            </Box>
          </Tredelt.SecondColumn>
        </Tredelt.Container>
      </SideLaster>
    </Side>
  );
}
