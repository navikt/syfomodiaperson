import React, { ReactElement } from "react";
import Side from "@/components/side/Side";
import Sidetopp from "@/components/side/Sidetopp";
import { Menypunkter } from "@/components/globalnavigasjon/GlobalNavigasjon";
import { BodyShort, Box, Button, VStack } from "@navikt/ds-react";
import * as Tredelt from "@/components/side/TredeltSide";
import SideLaster from "@/components/side/SideLaster";
import { isKandidat } from "@/data/kartleggingssporsmal/kartleggingssporsmalTypes";
import {
  useKartleggingssporsmalKandidatQuery,
  useKartleggingssporsmalSvarQuery,
} from "@/data/kartleggingssporsmal/kartleggingssporsmalQueryHooks";
import { tilDatoMedManedNavnOgKlokkeslett } from "@/utils/datoUtils";
import { Skjemasvar } from "@/components/skjemasvar/Skjemasvar";

const texts = {
  title: "Kartleggingsspørsmål",
  vurdereOppgaveText: "Behovet er vurdert, fjern oppgaven",
  kandidat: "Sykmeldt er kandidat og har mottatt kartleggingsspørsmål",
  svarMottatt: "Svar mottatt",
  extraInfo: "Informasjon om hva som skal gjøres ved vurdering",
  ikkeKandidatInfo1:
    "Den sykmeldte har ikke mottatt kartleggingsspørsmål da personen ikke er kandidat for å motta disse.",
  ikkeKandidatInfo2:
    "Når spørsmålene er besvart, vil du få en oppgave i oversikten din om å vurdere svarene. Svarene fra den sykmeldte dukker opp på denne siden.",
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
        {kandidat && isKandidat(kandidat) ? (
          <Tredelt.Container>
            <Tredelt.FirstColumn className="-xl:mb-2">
              <Box background="surface-default" className="p-6 gap-6">
                <div className="mb-4">
                  {`${texts.kandidat} (${tilDatoMedManedNavnOgKlokkeslett(
                    kandidat.varsletAt
                  )})`}
                </div>

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
        ) : (
          <Box
            background="surface-default"
            padding="6"
            className="flex flex-col gap-4"
          >
            <BodyShort size="small">{texts.ikkeKandidatInfo1}</BodyShort>
            <BodyShort size="small">{texts.ikkeKandidatInfo2}</BodyShort>
          </Box>
        )}
      </SideLaster>
    </Side>
  );
}
