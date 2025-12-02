import React from "react";
import Sidetopp from "../../../components/side/Sidetopp";
import { erIkkeIdag } from "@/utils/datoUtils";
import OppfolgingsplanerOversiktLPS from "../lps/OppfolgingsplanerOversiktLPS";
import { usePersonoppgaverQuery } from "@/data/personoppgave/personoppgaveQueryHooks";
import { toOppfolgingsplanLPSMedPersonoppgave } from "@/utils/oppfolgingsplanerUtils";
import { BodyShort, Box, Heading } from "@navikt/ds-react";
import OppfolgingsplanLink from "@/sider/oppfolgingsplan/oppfolgingsplaner/OppfolgingsplanLink";
import AktiveOppfolgingsplaner from "@/sider/oppfolgingsplan/oppfolgingsplaner/AktiveOppfolgingsplaner";

import { OppfolgingsplanLPS } from "@/sider/oppfolgingsplan/hooks/types/OppfolgingsplanLPS";
import { OppfolgingsplanDTO } from "@/sider/oppfolgingsplan/hooks/types/OppfolgingsplanDTO";
import { useGetOppfolgingsplanerV2Query } from "@/sider/oppfolgingsplan/hooks/oppfolgingsplanQueryHooks";
import { partitionOppfolgingsplanerByActiveTilfelle } from "@/sider/oppfolgingsplan/hooks/types/OppfolgingsplanV2DTO";
import { useOppfolgingstilfellePersonQuery } from "@/data/oppfolgingstilfelle/person/oppfolgingstilfellePersonQueryHooks";
import OppfolgingsplanV2Item from "@/sider/oppfolgingsplan/oppfolgingsplaner/OppfolgingsplanV2Item";

const texts = {
  titles: {
    tidligereOppfolgingsplaner: "Tidligere oppfølgingsplaner",
    lpsOppfolgingsplaner: "Oppfølgingsplaner med bistandsbehov",
  },
  alertMessages: {
    ingenTidligereOppfolgingsplaner: "Det er ingen tidligere oppfølgingsplaner",
    noLPSOppfolgingsplaner: "Det er ingen oppfølgingsplaner med bistandsbehov",
  },
};

interface Props {
  aktivePlaner: OppfolgingsplanDTO[];
  inaktivePlaner: OppfolgingsplanDTO[];
  oppfolgingsplanerLPS: OppfolgingsplanLPS[];
}

export default function OppfolgingsplanerOversikt({
  aktivePlaner,
  inaktivePlaner,
  oppfolgingsplanerLPS,
}: Props) {
  const getOppfolgingsplanerV2 = useGetOppfolgingsplanerV2Query();
  const getPersonOppgaverQuery = usePersonoppgaverQuery();
  const { latestOppfolgingstilfelle } = useOppfolgingstilfellePersonQuery();
  const oppfolgingsplanerLPSMedPersonOppgave = oppfolgingsplanerLPS.map(
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

  aktivePlaner.sort((a, b) => {
    return (
      new Date(b.godkjentPlan.deltMedNAVTidspunkt).getTime() -
      new Date(a.godkjentPlan.deltMedNAVTidspunkt).getTime()
    );
  });

  inaktivePlaner.sort((a, b) => {
    return (
      new Date(b.godkjentPlan.deltMedNAVTidspunkt).getTime() -
      new Date(a.godkjentPlan.deltMedNAVTidspunkt).getTime()
    );
  });

  const hasTidligereOppfolgingsplaner =
    inaktivePlaner.length !== 0 || oppfolgingsplanerLPSProcessed.length !== 0;

  const [aktiveOppfolgingsplanerV2, inaktiveOppfolgingsplanerV2] =
    !!latestOppfolgingstilfelle && getOppfolgingsplanerV2.isSuccess
      ? partitionOppfolgingsplanerByActiveTilfelle(
          getOppfolgingsplanerV2.data,
          latestOppfolgingstilfelle
        )
      : [[], []];

  return (
    <div>
      <Sidetopp tittel="Oppfølgingsplaner" />
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
            return <OppfolgingsplanLink key={index} dialog={dialog} />;
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
        <Box background="surface-default" className="p-4">
          <BodyShort>
            {texts.alertMessages.ingenTidligereOppfolgingsplaner}
          </BodyShort>
        </Box>
      )}
    </div>
  );
}
