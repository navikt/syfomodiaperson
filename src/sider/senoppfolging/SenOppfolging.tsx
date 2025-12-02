import React, { ReactElement } from "react";
import { useSenOppfolgingKandidatQuery } from "@/data/senoppfolging/useSenOppfolgingKandidatQuery";
import { KandidatSvar } from "@/sider/senoppfolging/KandidatSvar";
import { VurdertKandidat } from "@/sider/senoppfolging/VurdertKandidat";
import * as Tredelt from "@/components/side/TredeltSide";
import {
  SenOppfolgingStatus,
  SenOppfolgingVurderingType,
} from "@/data/senoppfolging/senOppfolgingTypes";
import { VeiledningRutine } from "@/sider/senoppfolging/VeiledningRutine";
import NewVurderingForm from "@/sider/senoppfolging/NewVurderingForm";
import OvingssideLink from "@/sider/senoppfolging/OvingssideLink";
import { KandidatIkkeSvart } from "@/sider/senoppfolging/KandidatIkkeSvart";
import { isVarselUbesvart } from "@/utils/senOppfolgingUtils";
import { Menypunkter } from "@/components/globalnavigasjon/GlobalNavigasjon";
import Sidetopp from "@/components/side/Sidetopp";
import Side from "@/components/side/Side";
import SideLaster from "@/components/side/SideLaster";
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
  const [kandidat, ...tidligereKandidater] = kandidater;
  const svar = kandidat?.svar;
  const varselAt = kandidat?.varselAt;
  const isFerdigbehandlet =
    kandidat?.status === SenOppfolgingStatus.FERDIGBEHANDLET;
  const ferdigbehandletVurdering = kandidat?.vurderinger.find(
    (vurdering) => vurdering.type === SenOppfolgingVurderingType.FERDIGBEHANDLET
  );

  return (
    <Side tittel={texts.title} aktivtMenypunkt={Menypunkter.SENOPPFOLGING}>
      <Sidetopp tittel={texts.title} />
      <SideLaster isLoading={isPending} isError={isError}>
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
                    <NewVurderingForm kandidat={kandidat} />
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
