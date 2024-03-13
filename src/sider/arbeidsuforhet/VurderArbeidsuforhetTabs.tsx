import React from "react";
import { useArbeidsuforhetVurderingQuery } from "@/data/arbeidsuforhet/arbeidsuforhetQueryHooks";
import styled from "styled-components";
import { Tabs } from "@navikt/ds-react";
import { VurderingType } from "@/data/arbeidsuforhet/arbeidsuforhetTypes";
import dayjs from "dayjs";
import { VurderingSkjema } from "@/sider/arbeidsuforhet/VurderingSkjema";

const texts = {
  oppfylt: "Oppfylt",
  avslag: "Avslag",
};

const StyledTabs = styled(Tabs)`
  margin-top: 1rem;
  width: 100%;

  .navds-tabs__tablist-wrapper {
    width: max-content;
  }
`;

enum Tab {
  OPPFYLT = "OPPFYLT",
  AVSLAG = "AVSLAG",
}

export const VurderArbeidsuforhetTabs = () => {
  const { data } = useArbeidsuforhetVurderingQuery();
  const forhandsvarsel = data[0];
  const frist = forhandsvarsel.varsel?.svarfrist;
  const isBeforeFrist = dayjs().isBefore(frist, "day");

  return (
    <StyledTabs defaultValue={Tab.OPPFYLT}>
      <Tabs.List>
        <Tabs.Tab value={Tab.OPPFYLT} label={texts.oppfylt} />
        {!isBeforeFrist && <Tabs.Tab value={Tab.AVSLAG} label={texts.avslag} />}
      </Tabs.List>
      <Tabs.Panel value={Tab.OPPFYLT}>
        <VurderingSkjema type={VurderingType.OPPFYLT} />
      </Tabs.Panel>
      {!isBeforeFrist && (
        <Tabs.Panel value={Tab.AVSLAG}>
          <VurderingSkjema type={VurderingType.AVSLAG} />
        </Tabs.Panel>
      )}
    </StyledTabs>
  );
};
