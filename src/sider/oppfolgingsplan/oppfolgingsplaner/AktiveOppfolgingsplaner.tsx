import { BodyShort, Box, Heading } from "@navikt/ds-react";
import React from "react";
import { erIdag } from "@/utils/datoUtils";
import dayjs from "dayjs";
import { OppfolgingsplanLPSMedPersonoppgave } from "@/sider/oppfolgingsplan/hooks/types/OppfolgingsplanLPS";
import { OppfolgingsplanDTO } from "@/sider/oppfolgingsplan/hooks/types/OppfolgingsplanDTO";
import OppfolgingsplanerOversiktLPS from "@/sider/oppfolgingsplan/lps/OppfolgingsplanerOversiktLPS";
import OppfolgingsplanLink from "@/sider/oppfolgingsplan/oppfolgingsplaner/OppfolgingsplanLink";
import { OppfolgingsplanV2DTO } from "@/sider/oppfolgingsplan/hooks/types/OppfolgingsplanV2DTO";
import OppfolgingsplanV2Item from "@/sider/oppfolgingsplan/oppfolgingsplaner/OppfolgingsplanV2Item";

const texts = {
  aktiveOppfolgingsplaner: "Aktive oppfølgingsplaner",
  ingenAktiveOppfolgingsplaner: "Det er ingen aktive oppfølgingsplaner",
};

interface Props {
  aktivePlaner: OppfolgingsplanDTO[];
  aktivePlanerV2: OppfolgingsplanV2DTO[];
  oppfolgingsplanerLPSMedPersonoppgave: OppfolgingsplanLPSMedPersonoppgave[];
}

export default function AktiveOppfolgingsplaner({
  aktivePlaner,
  aktivePlanerV2,
  oppfolgingsplanerLPSMedPersonoppgave,
}: Props) {
  const oppfolgingsplanerLPSUnprocessed = oppfolgingsplanerLPSMedPersonoppgave
    .filter((oppfolgingsplanLPS) => {
      if (oppfolgingsplanLPS.personoppgave) {
        if (oppfolgingsplanLPS.personoppgave.behandletTidspunkt) {
          return (
            Date.now() <
            dayjs(oppfolgingsplanLPS.personoppgave.behandletTidspunkt)
              .add(1, "days")
              .toDate()
              .getTime()
          );
        }
        return !oppfolgingsplanLPS.personoppgave.behandletTidspunkt;
      }
      return erIdag(oppfolgingsplanLPS.opprettet);
    })
    .sort((a, b) => {
      return new Date(b.opprettet).getTime() - new Date(a.opprettet).getTime();
    });

  const hasActivePlan =
    aktivePlaner.length !== 0 ||
    oppfolgingsplanerLPSUnprocessed.length !== 0 ||
    aktivePlanerV2.length !== 0;

  return (
    <div className="mb-8">
      <Heading spacing level="2" size="medium">
        {texts.aktiveOppfolgingsplaner}
      </Heading>
      {hasActivePlan ? (
        <>
          {oppfolgingsplanerLPSUnprocessed.map((planLPS, index) => (
            <OppfolgingsplanerOversiktLPS
              key={index}
              oppfolgingsplanLPSBistandsbehov={planLPS}
            />
          ))}
          {aktivePlaner.map((dialog, index) => (
            <OppfolgingsplanLink key={index} dialog={dialog} />
          ))}
          {aktivePlanerV2.map((plan, index) => (
            <OppfolgingsplanV2Item key={index} oppfolgingsplan={plan} />
          ))}
        </>
      ) : (
        <Box background="surface-default" className="p-4 mb-2">
          <BodyShort>{texts.ingenAktiveOppfolgingsplaner}</BodyShort>
        </Box>
      )}
    </div>
  );
}
