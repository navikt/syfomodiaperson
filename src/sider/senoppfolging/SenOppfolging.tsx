import React, { ReactElement, useState } from "react";
import { useSenOppfolgingKandidatQuery } from "@/data/senoppfolging/useSenOppfolgingKandidatQuery";
import { KandidatSvar } from "@/sider/senoppfolging/KandidatSvar";
import { VurdertKandidat } from "@/sider/senoppfolging/VurdertKandidat";
import * as Tredelt from "@/sider/TredeltSide";
import {
  SenOppfolgingStatus,
  SenOppfolgingVurderingType,
} from "@/data/senoppfolging/senOppfolgingTypes";
import { VeiledningRutine } from "@/sider/senoppfolging/VeiledningRutine";
import { NewVurderingForm } from "@/sider/senoppfolging/NewVurderingForm";
import OvingssideLink from "@/sider/senoppfolging/OvingssideLink";
import { KandidatIkkeSvart } from "@/sider/senoppfolging/KandidatIkkeSvart";
import { isVarselUbesvart } from "@/utils/senOppfolgingUtils";
import SenFaseFlexjar from "@/sider/senoppfolging/flexjar/SenFaseFlexjar";
import { useFeatureToggles } from "@/data/unleash/unleashQueryHooks";
import { StoreKey, useLocalStorageState } from "@/hooks/useLocalStorageState";
import { Menypunkter } from "@/components/globalnavigasjon/GlobalNavigasjon";
import Sidetopp from "@/components/Sidetopp";
import Side from "@/sider/Side";
import SideLaster from "@/components/SideLaster";
import IkkeKandidatInfo from "@/sider/senoppfolging/IkkeKandidatInfo";
import { SenOppfolgingHistorikk } from "@/sider/senoppfolging/historikk/SenOppfolgingHistorikk";

const texts = {
  title: "Snart slutt på sykepengene",
};

export default function SenOppfolging(): ReactElement {
  const {
    data: kandidater,
    isError,
    isPending,
  } = useSenOppfolgingKandidatQuery();
  const [isVurderingSubmitted, setIsVurderingSubmitted] =
    useState<boolean>(false);
  const [kandidat, ...tidligereKandidater] = kandidater;
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
  const { toggles } = useFeatureToggles();
  const showFlexjar = toggles.isSenFaseFlexjarEnabled && !hasGivenFeedback;

  return (
    <Side
      tittel={texts.title}
      aktivtMenypunkt={Menypunkter.SENOPPFOLGING}
      flexjar={isVurderingSubmitted && showFlexjar && <SenFaseFlexjar />}
    >
      <Sidetopp tittel={texts.title} />
      <SideLaster henter={isPending} hentingFeilet={isError}>
        {kandidat ? (
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
                <SenOppfolgingHistorikk historikk={tidligereKandidater} />
              </Tredelt.FirstColumn>
              <Tredelt.SecondColumn>
                <VeiledningRutine />
                <OvingssideLink />
              </Tredelt.SecondColumn>
            </Tredelt.Container>
          </div>
        ) : (
          <IkkeKandidatInfo />
        )}
      </SideLaster>
    </Side>
  );
}
