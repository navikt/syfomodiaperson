import React, { ReactElement } from "react";
import Side from "@/components/side/Side";
import Sidetopp from "@/components/side/Sidetopp";
import { Menypunkter } from "@/components/globalnavigasjon/GlobalNavigasjon";
import { Box, Button, VStack } from "@navikt/ds-react";
import * as Tredelt from "@/components/side/TredeltSide";
import KartleggingskandidatStatus from "@/sider/kartlegging/KartleggingskandidatStatus";
import SideLaster from "@/components/side/SideLaster";
import {
  hasReceivedQuestions,
  isKandidat,
} from "@/data/kartlegging/kartleggingTypes";
import Kartleggingssporsmalsvar from "@/sider/kartlegging/Kartleggingssporsmalsvar";
import {
  useKartleggingssporsmalKandidatQuery,
  useKartleggingssporsmalsvarQuery,
} from "@/data/kartlegging/kartleggingssporsmalQueryHooks";

const texts = {
  title: "Kartleggingsspørsmål",
};

export default function KartleggingContainer(): ReactElement {
  const {
    isLoading: isLoadingKartlegging,
    isError: isErrorKartlegging,
    data: kartleggingData,
  } = useKartleggingssporsmalKandidatQuery();

  const {
    isLoading: isLoadingKartleggingsvar,
    isError: isErrorKartleggingsvar,
    data: kartleggingsvar,
  } = useKartleggingssporsmalsvarQuery(
    isKandidat(kartleggingData) && hasReceivedQuestions(kartleggingData)
  );

  const isLoading = isLoadingKartlegging && isLoadingKartleggingsvar;
  const isError = isErrorKartlegging && isErrorKartleggingsvar;

  return (
    <Side tittel={texts.title} aktivtMenypunkt={Menypunkter.KARTLEGGING}>
      <Sidetopp tittel={texts.title} />
      <SideLaster henter={isLoading} hentingFeilet={isError}>
        <Tredelt.Container>
          <Tredelt.FirstColumn className="-xl:mb-2">
            <Box background="surface-default" className="p-6 gap-6">
              <KartleggingskandidatStatus kartleggingData={kartleggingData} />
              {kartleggingsvar && kartleggingsvar.formResponse !== null && (
                <>
                  <VStack gap={"4"}>
                    <Kartleggingssporsmalsvar
                      kartleggingssporsmalsvar={kartleggingsvar.formResponse}
                    />
                  </VStack>
                  <Button variant="secondary" size="small" className="mt-4">
                    Jeg har vurdert spørsmålene, fjern oppgaven.
                  </Button>
                </>
              )}
            </Box>
          </Tredelt.FirstColumn>
          <Tredelt.SecondColumn>
            <Box background="surface-default" padding="6" className="mb-2">
              Informasjon om hva som skal gjøres ved vurdering
            </Box>
          </Tredelt.SecondColumn>
        </Tredelt.Container>
      </SideLaster>
    </Side>
  );
}
