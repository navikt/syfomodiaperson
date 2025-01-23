import { Alert, Heading } from "@navikt/ds-react";
import BeOmOppfolgingsplan from "@/sider/oppfolgingsplan/oppfolgingsplaner/BeOmOppfolgingsplan";
import OppfolgingsplanerOversiktLPS from "@/sider/oppfolgingsplan/lps/OppfolgingsplanerOversiktLPS";
import OppfolgingsplanLink from "@/sider/oppfolgingsplan/oppfolgingsplaner/OppfolgingsplanLink";
import React from "react";
import { erIdag, tilLesbarDatoMedArUtenManedNavn } from "@/utils/datoUtils";
import dayjs from "dayjs";
import { useLedereQuery } from "@/data/leder/ledereQueryHooks";
import {
  useGetOppfolgingsplanForesporselQuery,
  usePostOppfolgingsplanForesporsel,
} from "@/data/oppfolgingsplan/oppfolgingsplanForesporselHooks";
import { useOppfolgingstilfellePersonQuery } from "@/data/oppfolgingstilfelle/person/oppfolgingstilfellePersonQueryHooks";
import { useFeatureToggles } from "@/data/unleash/unleashQueryHooks";
import { NarmesteLederRelasjonDTO } from "@/data/leder/ledereTypes";
import { OppfolgingstilfelleDTO } from "@/data/oppfolgingstilfelle/person/types/OppfolgingstilfellePersonDTO";
import { OppfolgingsplanLPSMedPersonoppgave } from "@/data/oppfolgingsplan/types/OppfolgingsplanLPS";
import { OppfolgingsplanDTO } from "@/data/oppfolgingsplan/types/OppfolgingsplanDTO";

const texts = {
  aktiveOppfolgingsplaner: "Aktive oppfølgingsplaner",
  ingenAktiveOppfolgingsplaner: "Det er ingen aktive oppfølgingsplaner",
  foresporselSendt: "Forespørsel om oppfølgingsplan ble sendt",
  aktivForesporsel:
    "Obs! Det ble bedt om oppfølgingsplan fra denne arbeidsgiveren",
};

function activeNarmesteLederForCurrentOppfolgingstilfelle(
  ledere: NarmesteLederRelasjonDTO[],
  oppfolgingsTilfelle: OppfolgingstilfelleDTO
): NarmesteLederRelasjonDTO[] {
  return ledere.filter(
    (leder) =>
      leder.status === "INNMELDT_AKTIV" &&
      oppfolgingsTilfelle.virksomhetsnummerList.includes(
        leder.virksomhetsnummer
      )
  );
}

interface Props {
  aktivePlaner: OppfolgingsplanDTO[];
  oppfolgingsplanerLPSMedPersonoppgave: OppfolgingsplanLPSMedPersonoppgave[];
}

export default function AktiveOppfolgingsplaner({
  aktivePlaner,
  oppfolgingsplanerLPSMedPersonoppgave,
}: Props) {
  const { toggles } = useFeatureToggles();
  const { currentLedere } = useLedereQuery();
  const getOppfolgingsplanForesporsel = useGetOppfolgingsplanForesporselQuery();
  const postOppfolgingsplanForesporsel = usePostOppfolgingsplanForesporsel();
  const { latestOppfolgingstilfelle, hasActiveOppfolgingstilfelle } =
    useOppfolgingstilfellePersonQuery();
  const currentOppfolgingstilfelle = hasActiveOppfolgingstilfelle
    ? latestOppfolgingstilfelle
    : undefined;

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
    aktivePlaner.length !== 0 || oppfolgingsplanerLPSUnprocessed.length !== 0;

  const activeNarmesteLedere = !!currentOppfolgingstilfelle
    ? activeNarmesteLederForCurrentOppfolgingstilfelle(
        currentLedere,
        currentOppfolgingstilfelle
      )
    : [];
  const activeNarmesteLederIfSingle =
    activeNarmesteLedere.length === 1 ? activeNarmesteLedere[0] : undefined;
  const isBeOmOppfolgingsplanVisible =
    toggles.isBeOmOppfolgingsplanEnabled &&
    !hasActivePlan &&
    !!currentOppfolgingstilfelle &&
    !!activeNarmesteLederIfSingle &&
    !postOppfolgingsplanForesporsel.isSuccess;

  const lastForesporselCreatedAt =
    getOppfolgingsplanForesporsel.data?.[0]?.createdAt;

  const isAktivForesporsel =
    !!lastForesporselCreatedAt &&
    !!currentOppfolgingstilfelle &&
    !postOppfolgingsplanForesporsel.isSuccess
      ? currentOppfolgingstilfelle.start <= lastForesporselCreatedAt &&
        lastForesporselCreatedAt <= currentOppfolgingstilfelle.end
      : false;
  const aktivForesporselTekst = `${
    texts.aktivForesporsel
  } ${tilLesbarDatoMedArUtenManedNavn(lastForesporselCreatedAt)}`;

  return (
    <div className="mb-8">
      <Heading spacing level="2" size="medium">
        {texts.aktiveOppfolgingsplaner}
      </Heading>
      {!hasActivePlan &&
        !postOppfolgingsplanForesporsel.isSuccess &&
        !isAktivForesporsel && (
          <Alert variant="info" className="mb-4">
            <p>{texts.ingenAktiveOppfolgingsplaner}</p>
          </Alert>
        )}
      {isAktivForesporsel && (
        <Alert variant="warning" className="mb-2">
          {aktivForesporselTekst}
        </Alert>
      )}
      {postOppfolgingsplanForesporsel.isSuccess && (
        <Alert variant="success" className="mb-4">
          {texts.foresporselSendt}
        </Alert>
      )}
      {isBeOmOppfolgingsplanVisible && (
        <BeOmOppfolgingsplan
          aktivNarmesteLeder={activeNarmesteLederIfSingle}
          postOppfolgingsplanForesporsel={postOppfolgingsplanForesporsel}
        />
      )}
      {oppfolgingsplanerLPSUnprocessed.map((planLPS, index) => {
        return (
          <OppfolgingsplanerOversiktLPS
            key={index}
            oppfolgingsplanLPSBistandsbehov={planLPS}
          />
        );
      })}
      {aktivePlaner.map((dialog, index) => {
        return <OppfolgingsplanLink key={index} dialog={dialog} />;
      })}
    </div>
  );
}
