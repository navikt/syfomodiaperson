import React from "react";
import ForhandsvarselSkjema from "@/sider/manglendemedvirkning/forhandsvarsel/ForhandsvarselSkjema";
import { useManglendeMedvirkningVurderingQuery } from "@/data/manglendemedvirkning/manglendeMedvirkningQueryHooks";
import { VurderingType } from "@/data/manglendemedvirkning/manglendeMedvirkningTypes";
import { Box } from "@navikt/ds-react";
import ForhandsvarselSendt from "@/sider/manglendemedvirkning/forhandsvarsel/ForhandsvarselSendt";

export default function ManglendeMedvirkning() {
  const { data } = useManglendeMedvirkningVurderingQuery();
  const sisteVurdering = data[0];
  const isForhandsvarsel =
    sisteVurdering?.vurderingType === VurderingType.FORHANDSVARSEL;

  return (
    <Box>
      {isForhandsvarsel ? (
        <ForhandsvarselSendt sisteVurdering={sisteVurdering} />
      ) : (
        <ForhandsvarselSkjema />
      )}
    </Box>
  );
}
