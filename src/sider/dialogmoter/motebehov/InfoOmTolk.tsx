import { BodyLong, Box, Heading, HStack } from "@navikt/ds-react";
import { LanguageIcon } from "@navikt/aksel-icons";
import { EksternLenke } from "@/components/EksternLenke";
import React from "react";
import { useBrukerinfoQuery } from "@/data/navbruker/navbrukerQueryHooks";
import { useMotebehovQuery } from "@/data/motebehov/motebehovQueryHooks";
import { useOppfolgingstilfellePersonQuery } from "@/data/oppfolgingstilfelle/person/oppfolgingstilfellePersonQueryHooks";
import {
  findFirst,
  getMotebehovInActiveTilfelle,
  onskerTolk,
  sorterMotebehovDataEtterDatoDesc,
} from "@/utils/motebehovUtils";
import { BrukerinfoDTO } from "@/data/navbruker/types/BrukerinfoDTO";
import { MotebehovInnmelder } from "@/data/motebehov/types/motebehovTypes";

const texts = {
  header: "Det er meldt inn behov for tolk",
  body: "Det har blitt meldt inn et behov for tolk for dialogmøte, og det er ikke registrert tolk på den sykmeldte tidligere.",
  url: "https://navno.sharepoint.com/sites/fag-og-ytelser-fagsystemer/SitePages/Endre%20person.aspx",
  urlText: "Ønsker du å registrere behov for tolk på vedkommende, klikk her.",
};

export const isTolkRegistrertIPdl = (brukerinfo: BrukerinfoDTO): boolean => {
  const { tilrettelagtKommunikasjon } = brukerinfo;
  return !!(
    tilrettelagtKommunikasjon &&
    ((tilrettelagtKommunikasjon.tegnsprakTolk &&
      tilrettelagtKommunikasjon.tegnsprakTolk.value) ||
      (tilrettelagtKommunikasjon.talesprakTolk &&
        tilrettelagtKommunikasjon.talesprakTolk.value))
  );
};

export const InfoOmTolk = () => {
  const { brukerinfo } = useBrukerinfoQuery();
  const { data: motebehov } = useMotebehovQuery();
  const { latestOppfolgingstilfelle } = useOppfolgingstilfellePersonQuery();
  const sortertMotebehov = motebehov.sort(sorterMotebehovDataEtterDatoDesc);
  const motebehovInActiveTilfelle = getMotebehovInActiveTilfelle(
    sortertMotebehov,
    latestOppfolgingstilfelle
  );
  const arbeidstaker = findFirst(
    MotebehovInnmelder.ARBEIDSTAKER,
    motebehovInActiveTilfelle
  );
  const arbeidsgiver = findFirst(
    MotebehovInnmelder.ARBEIDSGIVER,
    motebehovInActiveTilfelle
  );
  const arbeidstakerOnskerTolk = onskerTolk(arbeidstaker);
  const arbeidsgiverOnskerTolk = onskerTolk(arbeidsgiver);
  const visInfoOmRegistrereTolkIPdl =
    (arbeidstakerOnskerTolk || arbeidsgiverOnskerTolk) &&
    !isTolkRegistrertIPdl(brukerinfo);

  return (
    visInfoOmRegistrereTolkIPdl && (
      <Box
        background="surface-default"
        className="flex flex-col mb-4 p-6 gap-6"
      >
        <Heading size={"medium"} level={"2"}>
          <HStack>
            {texts.header}
            <LanguageIcon fontSize={"2rem"} />
          </HStack>
          <BodyLong>
            {texts.body}
            <EksternLenke href={texts.url} className={"pl-1"}>
              {texts.urlText}
            </EksternLenke>
          </BodyLong>
        </Heading>
      </Box>
    )
  );
};
