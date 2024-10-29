import React, { ReactElement, useState } from "react";
import { BodyShort, Box } from "@navikt/ds-react";
import { useSenOppfolgingKandidatQuery } from "@/data/senoppfolging/useSenOppfolgingKandidatQuery";
import { KandidatSvar } from "@/sider/senoppfolging/KandidatSvar";
import { VurdertKandidat } from "@/sider/senoppfolging/VurdertKandidat";
import * as Tredelt from "@/sider/TredeltSide";
import {
  SenOppfolgingKandidatResponseDTO,
  SenOppfolgingStatus,
  SenOppfolgingVurderingType,
} from "@/data/senoppfolging/senOppfolgingTypes";
import { VeiledningRutine } from "@/sider/senoppfolging/VeiledningRutine";
import { NewVurderingForm } from "@/sider/senoppfolging/NewVurderingForm";
import OvingssideLink from "@/sider/senoppfolging/OvingssideLink";
import { KandidatIkkeSvart } from "@/sider/senoppfolging/KandidatIkkeSvart";
import { isVarselUbesvart } from "@/utils/senOppfolgingUtils";
import SenFaseFlexjar from "@/components/flexjar/senfase/SenFaseFlexjar";
import { useFeatureToggles } from "@/data/unleash/unleashQueryHooks";
import { StoreKey, useLocalStorageState } from "@/hooks/useLocalStorageState";
import { useDiskresjonskodeQuery } from "@/data/diskresjonskode/diskresjonskodeQueryHooks";

const texts = {
  ikkeVarslet: {
    info1:
      "Den sykmeldte har ikke mottatt varsel om at det snart er slutt på sykepengene enda.",
    info2:
      "Når den sykmeldte har 90 dager eller mindre igjen av sykepengene, vil han eller hun få et varsel om å svare på spørsmål rundt sin situasjon på innloggede sider.",
    info3:
      "Når spørsmålene er besvart, vil du få en oppgave i oversikten din om å vurdere videre oppfølging. Svarene fra den sykmeldte dukker opp på denne siden.",
  },
};

export default function SenOppfolging(): ReactElement {
  const { data: kandidater } = useSenOppfolgingKandidatQuery();
  const [isVurderingSubmitted, setIsVurderingSubmitted] =
    useState<boolean>(false);
  const kandidat: SenOppfolgingKandidatResponseDTO | undefined = kandidater[0];
  const svar = kandidat?.svar;
  const varselAt = kandidat?.varselAt;
  const isFerdigbehandlet =
    kandidat?.status === SenOppfolgingStatus.FERDIGBEHANDLET;
  const ferdigbehandletVurdering = kandidat?.vurderinger.find(
    (vurdering) => vurdering.type === SenOppfolgingVurderingType.FERDIGBEHANDLET
  );
  const { storedValue: flexjarFeedbackDate } = useLocalStorageState<Date>(
    StoreKey.FLEXJAR_SEN_FASE_FEEDBACK_DATE
  );
  const hasGivenFeedback = !!flexjarFeedbackDate;

  const { data: diskresjonskode } = useDiskresjonskodeQuery();

  const { toggles } = useFeatureToggles();
  const showFlexjar =
    toggles.isSenFaseFlexjarEnabled &&
    !hasGivenFeedback &&
    diskresjonskode !== "6" &&
    diskresjonskode !== "7";

  return kandidat ? (
    <div className="flex flex-col">
      <Tredelt.Container>
        <Tredelt.FirstColumn>
          {svar && <KandidatSvar svar={svar} />}
          {!svar && varselAt && <KandidatIkkeSvart varselAt={varselAt} />}
          {isFerdigbehandlet && ferdigbehandletVurdering ? (
            <VurdertKandidat vurdering={ferdigbehandletVurdering} />
          ) : (
            (svar || isVarselUbesvart(kandidat)) && (
              <NewVurderingForm
                kandidat={kandidat}
                setIsSubmitted={setIsVurderingSubmitted}
              />
            )
          )}
        </Tredelt.FirstColumn>
        <Tredelt.SecondColumn>
          <VeiledningRutine />
          <OvingssideLink />
        </Tredelt.SecondColumn>
      </Tredelt.Container>
      {isVurderingSubmitted && showFlexjar && <SenFaseFlexjar />}
    </div>
  ) : (
    <Box
      background="surface-default"
      padding="6"
      className="flex flex-col gap-4"
    >
      <BodyShort size="small">{texts.ikkeVarslet.info1}</BodyShort>
      <BodyShort size="small">{texts.ikkeVarslet.info2}</BodyShort>
      <BodyShort size="small">{texts.ikkeVarslet.info3}</BodyShort>
    </Box>
  );
}
