import React from "react";
import {
  AktivitetskravDTO,
  AktivitetskravStatus,
} from "@/data/aktivitetskrav/aktivitetskravTypes";
import { Tabs } from "@navikt/ds-react";
import { UnntakAktivitetskravSkjema } from "@/sider/aktivitetskrav/vurdering/UnntakAktivitetskravSkjema";
import { OppfyltAktivitetskravSkjema } from "@/sider/aktivitetskrav/vurdering/OppfyltAktivitetskravSkjema";
import { SendForhandsvarselSkjema } from "@/sider/aktivitetskrav/vurdering/SendForhandsvarselSkjema";
import { IkkeOppfyltAktivitetskravSkjema } from "@/sider/aktivitetskrav/vurdering/IkkeOppfyltAktivitetskravSkjema";
import styled from "styled-components";
import { isExpiredForhandsvarsel } from "@/utils/aktivitetskravUtils";

const texts = {
  unntak: "Sett unntak",
  oppfylt: "Er i aktivitet",
  forhandsvarsel: "Send forhåndsvarsel",
  ikkeOppfylt: "Ikke oppfylt",
};

const StyledTabs = styled(Tabs)`
  margin-top: 1rem;
  width: 100%;

  .navds-tabs__tablist-wrapper {
    width: max-content;
  }
`;

enum Tab {
  UNNTAK = "UNNTAK",
  OPPFYLT = "OPPFYLT",
  FORHANDSVARSEL = "FORHANDSVARSEL",
  IKKE_OPPFYLT = "IKKE_OPPFYLT",
}

const isValidStateForForhandsvarsel = (
  aktivitetskravStatus: AktivitetskravStatus
) => {
  return (
    aktivitetskravStatus === AktivitetskravStatus.NY ||
    aktivitetskravStatus === AktivitetskravStatus.NY_VURDERING ||
    aktivitetskravStatus === AktivitetskravStatus.AVVENT
  );
};

interface VurderAktivitetskravTabsProps {
  aktivitetskrav: AktivitetskravDTO;
}

export const VurderAktivitetskravTabs = ({
  aktivitetskrav,
}: VurderAktivitetskravTabsProps) => {
  const latestVurdering = aktivitetskrav.vurderinger[0];
  const isIkkeOppfyltTabVisible =
    latestVurdering && isExpiredForhandsvarsel(latestVurdering);
  const isForhandsvarselTabVisible = isValidStateForForhandsvarsel(
    aktivitetskrav.status
  );

  const aktivitetskravUuid = aktivitetskrav.uuid;

  return (
    <StyledTabs defaultValue={Tab.UNNTAK}>
      <Tabs.List>
        <Tabs.Tab value={Tab.UNNTAK} label={texts.unntak} />
        <Tabs.Tab value={Tab.OPPFYLT} label={texts.oppfylt} />
        {isForhandsvarselTabVisible && (
          <Tabs.Tab value={Tab.FORHANDSVARSEL} label={texts.forhandsvarsel} />
        )}
        {isIkkeOppfyltTabVisible && (
          <Tabs.Tab value={Tab.IKKE_OPPFYLT} label={texts.ikkeOppfylt} />
        )}
      </Tabs.List>
      <Tabs.Panel value={Tab.UNNTAK}>
        <UnntakAktivitetskravSkjema aktivitetskravUuid={aktivitetskravUuid} />
      </Tabs.Panel>
      <Tabs.Panel value={Tab.OPPFYLT}>
        <OppfyltAktivitetskravSkjema aktivitetskravUuid={aktivitetskravUuid} />
      </Tabs.Panel>
      {isForhandsvarselTabVisible && (
        <Tabs.Panel value={Tab.FORHANDSVARSEL}>
          <SendForhandsvarselSkjema aktivitetskravUuid={aktivitetskravUuid} />
        </Tabs.Panel>
      )}
      {isIkkeOppfyltTabVisible && (
        <Tabs.Panel value={Tab.IKKE_OPPFYLT}>
          <IkkeOppfyltAktivitetskravSkjema
            aktivitetskravUuid={aktivitetskravUuid}
          />
        </Tabs.Panel>
      )}
    </StyledTabs>
  );
};
