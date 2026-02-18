import React from "react";
import {
  ledereWithActiveLedereFirst,
  SykmeldingLeder,
  virksomheterWithoutLeder,
} from "@/utils/ledereUtils";
import { PersonKortVirksomhetHeader } from "./PersonKortVirksomhetHeader";
import { NarmesteLederRelasjonDTO } from "@/data/leder/ledereTypes";
import { useLedereQuery } from "@/data/leder/ledereQueryHooks";
import { useGetSykmeldingerQuery } from "@/data/sykmelding/useGetSykmeldingerQuery";
import { Alert } from "@navikt/ds-react";
import { PersonKortVirksomhetLedere } from "@/components/personkort/ledere/PersonKortVirksomhetLedere";
import AppSpinner from "@/components/AppSpinner";

const texts = {
  noLeader:
    "Nærmeste leder mangler. Arbeidsgiveren må melde inn nærmeste leder i Altinn.",
};

export const sortLeaderListNewestFomDatoFirst = (
  leaderList: NarmesteLederRelasjonDTO[]
) => {
  return [...leaderList].sort((l1, l2) => {
    return new Date(l2.aktivFom).getTime() - new Date(l1.aktivFom).getTime();
  });
};

function groupArrayByKey(array: any, key: any) {
  return array.reduce((rv: any, x: any) => {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
}

export function PersonkortLedere() {
  const getLedereQuery = useLedereQuery();
  const getSykmeldingerQuery = useGetSykmeldingerQuery();

  const isLoading = getLedereQuery.isLoading || getSykmeldingerQuery.isLoading;

  const virksomheterFromSykmeldinger = virksomheterWithoutLeder(
    getLedereQuery.allLedere,
    getSykmeldingerQuery.sykmeldinger
  );
  const ledereWithActiveFirst = ledereWithActiveLedereFirst(
    getLedereQuery.allLedere,
    getSykmeldingerQuery.sykmeldinger
  );

  const virksomhetLederMap = groupArrayByKey(
    sortLeaderListNewestFomDatoFirst(ledereWithActiveFirst),
    "virksomhetsnummer"
  );
  const hasNoLeaders = Object.keys(virksomhetLederMap).length === 0;

  return isLoading ? (
    <AppSpinner />
  ) : hasNoLeaders ? (
    <Alert variant="info" size="small">
      {texts.noLeader}
    </Alert>
  ) : (
    <div>
      {Object.keys(virksomhetLederMap).map((virksomhetsnummer, idx) => {
        return (
          <PersonKortVirksomhetLedere
            key={idx}
            sykmeldinger={getSykmeldingerQuery.sykmeldinger}
            virksomhetLederMap={virksomhetLederMap}
            virksomhetsnummer={virksomhetsnummer}
          />
        );
      })}
      {virksomheterFromSykmeldinger.map(
        (virksomhet: SykmeldingLeder, idx: number) => {
          return (
            <PersonKortVirksomhetHeader
              key={idx}
              arbeidsgiverForskutterer={virksomhet.arbeidsgiverForskutterer}
              virksomhetsnavn={virksomhet.virksomhetsnavn}
              virksomhetsnummer={virksomhet.virksomhetsnummer}
              sykmeldinger={getSykmeldingerQuery.sykmeldinger}
            />
          );
        }
      )}
    </div>
  );
}
