import React from "react";
import { useMotebehovQuery } from "@/data/motebehov/motebehovQueryHooks";
import {
  mapMoteBehovToMeldtMotebehovFormat,
  mapMotebehovToSvarMotebehovFormat,
} from "@/utils/motebehovUtils";
import { Accordion, BodyShort, Box } from "@navikt/ds-react";
import DialogmoteHistorikkHeader from "@/sider/dialogmoter/components/motehistorikk/DialogmoteHistorikkHeader";
import {
  MotebehovSkjemaType,
  MotebehovVeilederDTO,
} from "@/data/motebehov/types/motebehovTypes";
import { tilLesbarDatoMedArstall } from "@/utils/datoUtils";

const texts = {
  title: "Møtebehovhistorikk",
  subtitle: "Oversikt over svar og innmeldte møtebehov",
  ingenSvarHistorikk: "Ingen tidligere møtebehov",
};

function MotebehovHistorikkEvent({
  motebehov,
}: {
  motebehov: MotebehovVeilederDTO;
}) {
  const behov =
    motebehov.skjemaType === MotebehovSkjemaType.MELD_BEHOV
      ? mapMoteBehovToMeldtMotebehovFormat(motebehov)
      : mapMotebehovToSvarMotebehovFormat(motebehov);
  return (
    <Accordion.Item>
      <Accordion.Header>
        {tilLesbarDatoMedArstall(behov.opprettetDato)}
      </Accordion.Header>
      <Accordion.Content>
        <BodyShort>Hei</BodyShort>
      </Accordion.Content>
    </Accordion.Item>
  );
}

export default function MotebehovHistorikk() {
  const { data } = useMotebehovQuery();
  const hasMotebehov = data.length > 0;

  return (
    <Box background="surface-default">
      <DialogmoteHistorikkHeader
        title={texts.title}
        subtitle={texts.subtitle}
      />
      {hasMotebehov ? (
        <Accordion>
          {data.map((motebehov, index) => (
            <MotebehovHistorikkEvent key={index} motebehov={motebehov} />
          ))}
        </Accordion>
      ) : (
        <BodyShort>{texts.ingenSvarHistorikk}</BodyShort>
      )}
    </Box>
  );
}
