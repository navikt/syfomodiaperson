import {
  ledereWithActiveLedereFirst,
  SykmeldingLeder,
  virksomheterWithoutLeder,
} from "@/utils/ledereUtils";
import { PersonKortVirksomhet } from "./PersonKortVirksomhet";
import { NarmesteLederRelasjonDTO } from "@/data/leder/ledereTypes";
import { useLedereQuery } from "@/data/leder/ledereQueryHooks";
import { useGetSykmeldingerQuery } from "@/data/sykmelding/useGetSykmeldingerQuery";
import { InfoCard } from "@navikt/ds-react";
import { InformationSquareIcon } from "@navikt/aksel-icons";
import AppSpinner from "@/components/AppSpinner";

const texts = {
  noLeader:
    "Nærmeste leder mangler. Arbeidsgiveren må melde inn nærmeste leder i Altinn.",
};

function sortLeaderListNewestFomDatoFirst(
  leaderList: NarmesteLederRelasjonDTO[],
) {
  return [...leaderList].sort((l1, l2) => {
    return new Date(l2.aktivFom).getTime() - new Date(l1.aktivFom).getTime();
  });
}

function groupArrayByKey(array: any, key: any) {
  return array.reduce((rv: any, x: any) => {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
}

export function PersonkortLedere() {
  const getLedereQuery = useLedereQuery();
  const getSykmeldingerQuery = useGetSykmeldingerQuery();

  const virksomheterFromSykmeldinger = virksomheterWithoutLeder(
    getLedereQuery.allLedere,
    getSykmeldingerQuery.sykmeldinger,
  );
  const ledereWithActiveFirst = ledereWithActiveLedereFirst(
    getLedereQuery.allLedere,
    getSykmeldingerQuery.sykmeldinger,
  );

  const virksomhetLederMap = groupArrayByKey(
    sortLeaderListNewestFomDatoFirst(ledereWithActiveFirst),
    "virksomhetsnummer",
  );
  const hasNoLeaders = Object.keys(virksomhetLederMap).length === 0;

  if (getLedereQuery.isLoading || getSykmeldingerQuery.isLoading) {
    return <AppSpinner />;
  }

  return (
    <div>
      {hasNoLeaders && (
        <InfoCard data-color="info" size="small" className="mb-4">
          <InfoCard.Message icon={<InformationSquareIcon aria-hidden />}>
            {texts.noLeader}
          </InfoCard.Message>
        </InfoCard>
      )}
      {Object.keys(virksomhetLederMap).map((virksomhetsnummer, idx) => {
        const ledere: NarmesteLederRelasjonDTO[] =
          virksomhetLederMap[virksomhetsnummer];
        const currentLeder = ledere[0];
        if (!currentLeder) return null;

        return (
          <PersonKortVirksomhet
            key={`virksomhetLederMap-${idx}-${virksomhetsnummer}`}
            sykmeldinger={getSykmeldingerQuery.sykmeldinger}
            ledere={ledere}
            arbeidsgiverForskutterer={currentLeder.arbeidsgiverForskutterer}
            virksomhetsnavn={currentLeder.virksomhetsnavn}
            virksomhetsnummer={virksomhetsnummer}
          />
        );
      })}
      {virksomheterFromSykmeldinger.map(
        (virksomhet: SykmeldingLeder, idx: number) => {
          return (
            <PersonKortVirksomhet
              key={`virksomheterFromSykmeldinger-${idx}-${virksomhet.virksomhetsnummer}`}
              arbeidsgiverForskutterer={virksomhet.arbeidsgiverForskutterer}
              virksomhetsnavn={virksomhet.virksomhetsnavn}
              virksomhetsnummer={virksomhet.virksomhetsnummer}
              sykmeldinger={getSykmeldingerQuery.sykmeldinger}
            />
          );
        },
      )}
    </div>
  );
}
