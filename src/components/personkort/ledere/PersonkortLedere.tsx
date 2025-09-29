import React from "react";
import {
  ledereWithActiveLedereFirst,
  SykmeldingLeder,
  virksomheterWithoutLeder,
} from "@/utils/ledereUtils";
import PersonkortFeilmelding from "../PersonkortFeilmelding";
import PersonKortVirksomhetLedere from "./PersonKortVirksomhetLedere";
import PersonKortVirksomhetHeader from "./PersonKortVirksomhetHeader";
import { NarmesteLederRelasjonDTO } from "@/data/leder/ledereTypes";
import { useLedereQuery } from "@/data/leder/ledereQueryHooks";
import { useGetSykmeldingerQuery } from "@/data/sykmelding/useGetSykmeldingerQuery";

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

const PersonkortLedere = () => {
  const { allLedere } = useLedereQuery();
  const { sykmeldinger } = useGetSykmeldingerQuery();
  const virksomheterFromSykmeldinger = virksomheterWithoutLeder(
    allLedere,
    sykmeldinger
  );
  const ledereWithActiveFirst = ledereWithActiveLedereFirst(
    allLedere,
    sykmeldinger
  );

  const virksomhetLederMap = groupArrayByKey(
    sortLeaderListNewestFomDatoFirst(ledereWithActiveFirst),
    "virksomhetsnummer"
  );
  if (Object.keys(virksomhetLederMap).length === 0) {
    return <PersonkortFeilmelding>{texts.noLeader}</PersonkortFeilmelding>;
  } else {
    return (
      <div>
        {Object.keys(virksomhetLederMap).map((virksomhetsnummer, idx) => {
          return (
            <PersonKortVirksomhetLedere
              key={idx}
              sykmeldinger={sykmeldinger}
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
                sykmeldinger={sykmeldinger}
              />
            );
          }
        )}
      </div>
    );
  }
};

export default PersonkortLedere;
