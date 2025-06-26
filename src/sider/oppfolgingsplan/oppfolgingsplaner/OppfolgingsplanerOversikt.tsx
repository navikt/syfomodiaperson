import React from "react";
import Sidetopp from "../../../components/side/Sidetopp";
import { erIkkeIdag } from "@/utils/datoUtils";
import OppfolgingsplanerOversiktLPS from "../lps/OppfolgingsplanerOversiktLPS";
import { OppfolgingsplanLPS } from "@/data/oppfolgingsplan/types/OppfolgingsplanLPS";
import { usePersonoppgaverQuery } from "@/data/personoppgave/personoppgaveQueryHooks";
import { OppfolgingsplanDTO } from "@/data/oppfolgingsplan/types/OppfolgingsplanDTO";
import { toOppfolgingsplanLPSMedPersonoppgave } from "@/utils/oppfolgingsplanerUtils";
import { BodyShort, Box, Heading } from "@navikt/ds-react";
import OppfolgingsplanLink from "@/sider/oppfolgingsplan/oppfolgingsplaner/OppfolgingsplanLink";
import AktiveOppfolgingsplaner from "@/sider/oppfolgingsplan/oppfolgingsplaner/AktiveOppfolgingsplaner";

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
  const { data: personoppgaver } = usePersonoppgaverQuery();
  const oppfolgingsplanerLPSMedPersonOppgave = oppfolgingsplanerLPS.map(
    (oppfolgingsplanLPS) =>
      toOppfolgingsplanLPSMedPersonoppgave(oppfolgingsplanLPS, personoppgaver)
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

  return (
    <div>
      <Sidetopp tittel="Oppfølgingsplaner" />
      <AktiveOppfolgingsplaner
        aktivePlaner={aktivePlaner}
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
