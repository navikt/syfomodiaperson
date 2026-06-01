import React from "react";
import Sidetopp from "../../../components/side/Sidetopp";
import { erIkkeIdag } from "@/utils/datoUtils";
import OppfolgingsplanerOversiktLPS from "../lps/OppfolgingsplanerOversiktLPS";
import { usePersonoppgaverQuery } from "@/data/personoppgave/personoppgaveQueryHooks";
import { toOppfolgingsplanLPSMedPersonoppgave } from "@/utils/oppfolgingsplanerUtils";
import { BodyShort, Box, Heading } from "@navikt/ds-react";
import OppfolgingsplanV1Item from "@/sider/oppfolgingsplan/oppfolgingsplaner/OppfolgingsplanV1Item.tsx";
import * as Tredelt from "@/components/side/TredeltSide";
import OppfolgingsplanV2Item from "@/sider/oppfolgingsplan/oppfolgingsplaner/OppfolgingsplanV2Item";
import { Menypunkter } from "@/components/globalnavigasjon/GlobalNavigasjon";
import SideLaster from "@/components/side/SideLaster";
import Side from "@/components/side/Side";
import BeOmOppfolgingsplan from "@/sider/oppfolgingsplan/oppfolgingsplaner/BeOmOppfolgingsplan";
import { useLedereQuery } from "@/data/leder/ledereQueryHooks";
import AktiveOppfolgingsplaner from "@/sider/oppfolgingsplan/oppfolgingsplaner/AktiveOppfolgingsplaner";
import { aktiveNarmesteLedereForOppfolgingstilfelle } from "@/data/oppfolgingstilfelle/person/types/OppfolgingstilfellePersonDTO";
import LumiSurvey from "@/components/lumi/LumiSurvey";
import { oppfolgingsplanSurvey } from "@/components/lumi/oppfolgingsplanSurvey";
import { useOppfolgingsplaner } from "@/sider/oppfolgingsplan/hooks/useOppfolgingsplaner";
import { useOppfolgingstilfellePersonQuery } from "@/data/oppfolgingstilfelle/person/oppfolgingstilfellePersonQueryHooks.ts";

const texts = {
  pageTitle: "Oppfølgingsplaner",
  titles: {
    tidligereOppfolgingsplaner: "Tidligere oppfølgingsplaner",
    lpsOppfolgingsplaner: "Oppfølgingsplaner med bistandsbehov",
  },
  alertMessages: {
    ingenTidligereOppfolgingsplaner: "Det er ingen tidligere oppfølgingsplaner",
    noLPSOppfolgingsplaner: "Det er ingen oppfølgingsplaner med bistandsbehov",
  },
};

export default function OppfolgingsplanerOversikt() {
  const { latestOppfolgingstilfelle, hasActiveOppfolgingstilfelle } =
    useOppfolgingstilfellePersonQuery();
  const {
    aktivePlaner,
    inaktivePlaner,
    aktivePlanerV2: aktiveOppfolgingsplanerV2,
    inaktivePlanerV2: inaktiveOppfolgingsplanerV2,
    lpsPlaner,
    isLoading,
    isError,
  } = useOppfolgingsplaner();
  const currentOppfolgingstilfelle = hasActiveOppfolgingstilfelle
    ? latestOppfolgingstilfelle
    : undefined;
  const { currentLedere } = useLedereQuery();

  const getPersonOppgaverQuery = usePersonoppgaverQuery();
  const oppfolgingsplanerLPSMedPersonOppgave = lpsPlaner.map(
    (oppfolgingsplanLPS) =>
      toOppfolgingsplanLPSMedPersonoppgave(
        oppfolgingsplanLPS,
        getPersonOppgaverQuery.data
      )
  );

  const oppfolgingsplanerLPSProcessed = oppfolgingsplanerLPSMedPersonOppgave
    .filter((oppfolgingsplanLPS) => {
      if (oppfolgingsplanLPS.personoppgave) {
        return oppfolgingsplanLPS.personoppgave.behandletTidspunkt;
      } else {
        return erIkkeIdag(oppfolgingsplanLPS.opprettet);
      }
    })
    .sort((a, b) => {
      return new Date(b.opprettet).getTime() - new Date(a.opprettet).getTime();
    });

  const hasTidligereOppfolgingsplaner =
    inaktivePlaner.length !== 0 ||
    oppfolgingsplanerLPSProcessed.length !== 0 ||
    inaktiveOppfolgingsplanerV2.length !== 0;

  const activeNarmesteLedere = !!currentOppfolgingstilfelle
    ? aktiveNarmesteLedereForOppfolgingstilfelle(
        currentLedere,
        currentOppfolgingstilfelle
      )
    : [];
  const isBeOmOppfolgingsplanVisible =
    !!currentOppfolgingstilfelle && activeNarmesteLedere.length > 0;
  const lumiSurvey =
    aktiveOppfolgingsplanerV2.length > 0 ? (
      <LumiSurvey
        surveyId="modia-ny-oppfolgingsplan"
        survey={oppfolgingsplanSurvey}
      />
    ) : null;

  return (
    <Side
      tittel="Oppfølgingsplaner"
      aktivtMenypunkt={Menypunkter.OPPFOELGINGSPLANER}
      lumi={lumiSurvey}
    >
      <SideLaster isLoading={isLoading} isError={isError}>
        <Sidetopp tittel={texts.pageTitle} />
        <Tredelt.Container className="-xl:flex-col-reverse">
          <Tredelt.FirstColumn className="-xl:mb-2">
            <AktiveOppfolgingsplaner
              aktivePlaner={aktivePlaner}
              aktivePlanerV2={aktiveOppfolgingsplanerV2}
              oppfolgingsplanerLPSMedPersonoppgave={
                oppfolgingsplanerLPSMedPersonOppgave
              }
            />

            <Heading spacing level="2" size="medium">
              {texts.titles.tidligereOppfolgingsplaner}
            </Heading>
            {hasTidligereOppfolgingsplaner ? (
              <>
                {inaktivePlaner.map((dialog, index) => {
                  return (
                    <OppfolgingsplanV1Item
                      key={index}
                      oppfolgingsplan={dialog}
                    />
                  );
                })}
                {oppfolgingsplanerLPSProcessed.map((planLPS, index) => {
                  return (
                    <OppfolgingsplanerOversiktLPS
                      key={index}
                      oppfolgingsplanLPSBistandsbehov={planLPS}
                    />
                  );
                })}
                {inaktiveOppfolgingsplanerV2.map((plan, index) => (
                  <OppfolgingsplanV2Item key={index} oppfolgingsplan={plan} />
                ))}
              </>
            ) : (
              <Box background="default" className="p-4">
                <BodyShort>
                  {texts.alertMessages.ingenTidligereOppfolgingsplaner}
                </BodyShort>
              </Box>
            )}
          </Tredelt.FirstColumn>
          {isBeOmOppfolgingsplanVisible && (
            <Tredelt.SecondColumn className="mt-11">
              <BeOmOppfolgingsplan
                activeNarmesteLedere={activeNarmesteLedere}
                currentOppfolgingstilfelle={currentOppfolgingstilfelle}
              />
            </Tredelt.SecondColumn>
          )}
        </Tredelt.Container>
      </SideLaster>
    </Side>
  );
}
