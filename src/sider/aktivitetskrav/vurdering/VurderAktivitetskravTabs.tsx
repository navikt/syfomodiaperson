import React from "react";
import {
  AktivitetskravDTO,
  AktivitetskravStatus,
} from "@/data/aktivitetskrav/aktivitetskravTypes";
import { Tabs } from "@navikt/ds-react";
import { UnntakAktivitetskravSkjema } from "@/sider/aktivitetskrav/vurdering/UnntakAktivitetskravSkjema";
import { OppfyltAktivitetskravSkjema } from "@/sider/aktivitetskrav/vurdering/OppfyltAktivitetskravSkjema";
import { SendForhandsvarselSkjema } from "@/sider/aktivitetskrav/vurdering/SendForhandsvarselSkjema";
import InnstillingOmStansSkjema from "@/sider/aktivitetskrav/vurdering/InnstillingOmStansSkjema";
import styled from "styled-components";
import { isExpiredForhandsvarsel } from "@/utils/datoUtils";

const texts = {
  unntak: "Sett unntak",
  oppfylt: "Er i aktivitet",
  forhandsvarsel: "Send forhåndsvarsel",
  innstillingOmStans: "Skriv innstilling om stans",
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
  INNSTILLING_OM_STANS = "INNSTILLING_OM_STANS",
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

interface Props {
  aktivitetskrav: AktivitetskravDTO;
}

export function VurderAktivitetskravTabs({ aktivitetskrav }: Props) {
  const latestVurdering = aktivitetskrav.vurderinger[0];
  const isInnstillingOmStansTabVisible =
    latestVurdering &&
    isExpiredForhandsvarsel(latestVurdering.varsel?.svarfrist);
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
        {isInnstillingOmStansTabVisible && (
          <Tabs.Tab
            value={Tab.INNSTILLING_OM_STANS}
            label={texts.innstillingOmStans}
          />
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
      {isInnstillingOmStansTabVisible &&
        !!latestVurdering.varsel?.svarfrist && (
          <Tabs.Panel value={Tab.INNSTILLING_OM_STANS}>
            <InnstillingOmStansSkjema
              aktivitetskravUuid={aktivitetskravUuid}
              varselSvarfrist={latestVurdering.varsel?.svarfrist}
            />
          </Tabs.Panel>
        )}
    </StyledTabs>
  );
}
