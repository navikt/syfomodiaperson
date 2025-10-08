import React, { ReactElement } from "react";
import Side from "@/components/side/Side";
import Sidetopp from "@/components/side/Sidetopp";
import { Menypunkter } from "@/components/globalnavigasjon/GlobalNavigasjon";
import { Box, Button, VStack } from "@navikt/ds-react";
import * as Tredelt from "@/components/side/TredeltSide";
import SideLaster from "@/components/side/SideLaster";
import { isKandidat } from "@/data/kartleggingssporsmal/kartleggingssporsmalTypes";
import {
  useKartleggingssporsmalKandidatQuery,
  useKartleggingssporsmalSvarQuery,
} from "@/data/kartleggingssporsmal/kartleggingssporsmalQueryHooks";
import { tilDatoMedManedNavnOgKlokkeslett } from "@/utils/datoUtils";
import { Skjemasvar } from "@/sider/dialogmoter/motebehov/skjema/Skjemasvar";

const texts = {
  title: "Kartleggingsspørsmål",
  vurdereOppgaveText: "Behovet er vurdert, fjern oppgaven",
  kandidat: "Sykmeldt er kandidat og har mottatt kartleggingsspørsmål",
  ikkeKandidat: "Sykmeldt har ikke blitt kandidat",
  svarMottatt: "Svar mottatt",
  extraInfo: "Informasjon om hva som skal gjøres ved vurdering",
};

export default function KartleggingssporsmalSide(): ReactElement {
  const getKandidat = useKartleggingssporsmalKandidatQuery();
  const kandidat = getKandidat.data;
  const getKartleggingssporsmalSvar = useKartleggingssporsmalSvarQuery(
    isKandidat(kandidat)
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
              {kandidat && isKandidat(kandidat) ? (
                <div className="mb-4">
                  {`${texts.kandidat} (${tilDatoMedManedNavnOgKlokkeslett(
                    kandidat.varsletAt
                  )})`}
                </div>
              ) : (
                <div>{texts.ikkeKandidat}</div>
              )}

              {kartleggingsvar && kartleggingsvar.formResponse !== null && (
                <>
                  <VStack gap="4">
                    <div>
                      {`${
                        texts.svarMottatt
                      }: ${tilDatoMedManedNavnOgKlokkeslett(
                        kartleggingsvar.formResponse.createdAt
                      )}`}
                    </div>
                    <Skjemasvar
                      formSnapshot={kartleggingsvar.formResponse.formSnapshot}
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
