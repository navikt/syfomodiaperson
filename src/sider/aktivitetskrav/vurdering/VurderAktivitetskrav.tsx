import React from "react";
import {
  AktivitetskravDTO,
  AktivitetskravStatus,
} from "@/data/aktivitetskrav/aktivitetskravTypes";
import { VurderAktivitetskravTabs } from "@/sider/aktivitetskrav/vurdering/VurderAktivitetskravTabs";
import { Box, Heading } from "@navikt/ds-react";
import { VurderAktivitetskravButtons } from "@/sider/aktivitetskrav/vurdering/VurderAktivitetskravButtons";
import { GjelderOppfolgingstilfelle } from "@/sider/aktivitetskrav/GjelderOppfolgingstilfelle";
import { useOppfolgingstilfellePersonQuery } from "@/data/oppfolgingstilfelle/person/oppfolgingstilfellePersonQueryHooks";
import { AktivitetskravVurderingAlert } from "@/sider/aktivitetskrav/vurdering/AktivitetskravVurderingAlert";
import ForhandsvarselOppsummering from "@/sider/aktivitetskrav/vurdering/ForhandsvarselOppsummering";
import {
  isDateInOppfolgingstilfelle,
  OppfolgingstilfelleDTO,
} from "@/data/oppfolgingstilfelle/person/types/OppfolgingstilfellePersonDTO";

export const texts = {
  header: "Vurdere aktivitetskravet",
};

export function oppfolgingstilfelleForAktivitetskrav(
  aktivitetskrav: AktivitetskravDTO,
  oppfolgingstilfeller: OppfolgingstilfelleDTO[]
): OppfolgingstilfelleDTO | undefined {
  return oppfolgingstilfeller.find((tilfelle) =>
    isDateInOppfolgingstilfelle(aktivitetskrav.stoppunktAt, tilfelle)
  );
}

interface VurderAktivitetskravProps {
  aktivitetskrav: AktivitetskravDTO;
}

export const VurderAktivitetskrav = ({
  aktivitetskrav,
}: VurderAktivitetskravProps) => {
  const { tilfellerDescendingStart } = useOppfolgingstilfellePersonQuery();
  const oppfolgingstilfelle = oppfolgingstilfelleForAktivitetskrav(
    aktivitetskrav,
    tilfellerDescendingStart
  );
  const currentVurdering = aktivitetskrav.vurderinger[0];
  const showVurderAktivitetskravAlert =
    currentVurdering?.status === AktivitetskravStatus.AVVENT ||
    currentVurdering?.status === AktivitetskravStatus.FORHANDSVARSEL;

  return (
    <>
      {showVurderAktivitetskravAlert && (
        <AktivitetskravVurderingAlert vurdering={currentVurdering} />
      )}
      {currentVurdering?.varsel && (
        <ForhandsvarselOppsummering
          varsel={currentVurdering.varsel}
          beskrivelse={currentVurdering.beskrivelse}
        />
      )}
      <Box
        background="surface-default"
        className="mb-4 flex flex-col pt-4 pr-4 pb-8 pl-8"
      >
        <div className="flex flex-row">
          <Heading level="2" size="medium" className="mb-1">
            {texts.header}
          </Heading>
          <VurderAktivitetskravButtons aktivitetskrav={aktivitetskrav} />
        </div>
        {oppfolgingstilfelle && (
          <GjelderOppfolgingstilfelle
            oppfolgingstilfelle={oppfolgingstilfelle}
          />
        )}
        <VurderAktivitetskravTabs aktivitetskrav={aktivitetskrav} />
      </Box>
    </>
  );
};
