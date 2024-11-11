import React, { ReactElement } from "react";
import Side from "@/sider/Side";
import Sidetopp from "@/components/Sidetopp";
import SideLaster from "@/components/SideLaster";
import UtdragFraSykefravaeret from "@/components/utdragFraSykefravaeret/UtdragFraSykefravaeret";
import * as Tredelt from "@/sider/TredeltSide";
import { Menypunkter } from "@/components/globalnavigasjon/GlobalNavigasjon";
import { useGetArbeidsuforhetVurderingerQuery } from "@/data/arbeidsuforhet/arbeidsuforhetQueryHooks";
import { VurderingHistorikk } from "@/sider/arbeidsuforhet/historikk/VurderingHistorikk";
import { EmojiRatingFlexjar } from "@/sider/arbeidsuforhet/flexjar/EmojiRatingFlexjar";
import { StoreKey, useLocalStorageState } from "@/hooks/useLocalStorageState";
import { useFeatureToggles } from "@/data/unleash/unleashQueryHooks";

const texts = {
  title: "Arbeidsuførhet",
};

interface Props {
  children: ReactElement;
}

export function ArbeidsuforhetSide({ children }: Props): ReactElement {
  const { isLoading, isError } = useGetArbeidsuforhetVurderingerQuery();

  const { toggles } = useFeatureToggles();
  const { storedValue: flexjarFeedbackDate } = useLocalStorageState<Date>(
    StoreKey.FLEXJAR_ARBEIDSUFORHET_FEEDBACK_DATE
  );
  const hasGivenFeedback = !!flexjarFeedbackDate;
  const isFlexjarVisible = toggles.isFlexjarEnabled && !hasGivenFeedback;

  return (
    <Side
      tittel={texts.title}
      aktivtMenypunkt={Menypunkter.ARBEIDSUFORHET}
      flexjar={isFlexjarVisible && <EmojiRatingFlexjar />}
    >
      <Sidetopp tittel={texts.title} />
      <SideLaster henter={isLoading} hentingFeilet={isError}>
        <Tredelt.Container>
          <Tredelt.FirstColumn>
            {children}
            <VurderingHistorikk />
          </Tredelt.FirstColumn>
          <Tredelt.SecondColumn>
            <UtdragFraSykefravaeret />
          </Tredelt.SecondColumn>
        </Tredelt.Container>
      </SideLaster>
    </Side>
  );
}
