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
import { DraftTextDTO, useDraftQuery } from "@/hooks/useDraftQuery";
import AppSpinner from "@/components/AppSpinner";

const texts = {
  unntak: "Sett unntak",
  oppfylt: "Er i aktivitet",
  forhandsvarsel: "Send forhåndsvarsel",
  innstillingOmStans: "Skriv innstilling om stans",
};

const StyledTabs = styled(Tabs)`
  margin-top: 1rem;
  width: 100%;

  .aksel-tabs__tablist-wrapper {
    width: max-content;
  }
`;

enum Tab {
  UNNTAK = "UNNTAK",
  OPPFYLT = "OPPFYLT",
  FORHANDSVARSEL = "FORHANDSVARSEL",
  INNSTILLING_OM_STANS = "INNSTILLING_OM_STANS",
}

function isValidStateForForhandsvarsel(
  aktivitetskravStatus: AktivitetskravStatus
) {
  return (
    aktivitetskravStatus === AktivitetskravStatus.NY ||
    aktivitetskravStatus === AktivitetskravStatus.NY_VURDERING ||
    aktivitetskravStatus === AktivitetskravStatus.AVVENT
  );
}

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

  const unntakDraft = useDraftQuery<DraftTextDTO>("aktivitetskrav-unntak");
  const oppfyltDraft = useDraftQuery<DraftTextDTO>("aktivitetskrav-oppfylt");
  const forhandsvarselDraft = useDraftQuery<DraftTextDTO>(
    "aktivitetskrav-forhandsvarsel"
  );
  const innstillingOmStansDraft = useDraftQuery<DraftTextDTO>(
    "aktivitetskrav-innstilling-om-stans"
  );

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
        {unntakDraft.isPending ? (
          <AppSpinner />
        ) : (
          <UnntakAktivitetskravSkjema
            aktivitetskravUuid={aktivitetskravUuid}
            begrunnelseUtkast={unntakDraft.data?.begrunnelse}
          />
        )}
      </Tabs.Panel>
      <Tabs.Panel value={Tab.OPPFYLT}>
        {oppfyltDraft.isPending ? (
          <AppSpinner />
        ) : (
          <OppfyltAktivitetskravSkjema
            aktivitetskravUuid={aktivitetskravUuid}
            begrunnelseUtkast={oppfyltDraft.data?.begrunnelse}
          />
        )}
      </Tabs.Panel>
      {isForhandsvarselTabVisible && (
        <Tabs.Panel value={Tab.FORHANDSVARSEL}>
          {forhandsvarselDraft.isPending ? (
            <AppSpinner />
          ) : (
            <SendForhandsvarselSkjema
              aktivitetskravUuid={aktivitetskravUuid}
              begrunnelseUtkast={forhandsvarselDraft.data?.begrunnelse}
            />
          )}
        </Tabs.Panel>
      )}
      {isInnstillingOmStansTabVisible &&
        !!latestVurdering.varsel?.svarfrist && (
          <Tabs.Panel value={Tab.INNSTILLING_OM_STANS}>
            {innstillingOmStansDraft.isPending ? (
              <AppSpinner />
            ) : (
              <InnstillingOmStansSkjema
                aktivitetskravUuid={aktivitetskravUuid}
                varselSvarfrist={latestVurdering.varsel?.svarfrist}
                begrunnelseUtkast={innstillingOmStansDraft.data?.begrunnelse}
              />
            )}
          </Tabs.Panel>
        )}
    </StyledTabs>
  );
}
