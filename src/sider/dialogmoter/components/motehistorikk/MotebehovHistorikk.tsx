import React from "react";
import { useMotebehovQuery } from "@/data/motebehov/motebehovQueryHooks";
import { isArbeidstakerMotebehov } from "@/utils/motebehovUtils";
import { Accordion, BodyShort, Box } from "@navikt/ds-react";
import DialogmoteHistorikkHeader from "@/sider/dialogmoter/components/motehistorikk/DialogmoteHistorikkHeader";
import { MotebehovVeilederDTO } from "@/data/motebehov/types/motebehovTypes";
import { tilLesbarDatoMedArstall } from "@/utils/datoUtils";
import {
  MotebehovArbeidsgiverKvittering,
  MotebehovKvitteringInnholdArbeidstaker,
} from "@/sider/dialogmoter/motebehov/MotebehovKvittering";

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
  const isArbeidstaker = isArbeidstakerMotebehov(motebehov);
  const headerText = `Møtebehov fra ${
    isArbeidstaker ? "den sykmeldte" : "nærmeste leder"
  } ${tilLesbarDatoMedArstall(motebehov.opprettetDato)}`;
  const isBehandlet =
    motebehov.behandletTidspunkt && motebehov.behandletVeilederIdent;
  return (
    <Accordion.Item>
      <Accordion.Header>{headerText}</Accordion.Header>
      <Accordion.Content>
        {isArbeidstaker ? (
          <MotebehovKvitteringInnholdArbeidstaker
            arbeidstakersMotebehov={motebehov}
          />
        ) : (
          <MotebehovArbeidsgiverKvittering motebehov={motebehov} />
        )}
        {isBehandlet && (
          <BodyShort className="mt-2">{`Møtebehovet ble vurdert av ${
            motebehov.behandletVeilederIdent
          } den ${tilLesbarDatoMedArstall(
            motebehov.behandletTidspunkt
          )}.`}</BodyShort>
        )}
      </Accordion.Content>
    </Accordion.Item>
  );
}

export default function MotebehovHistorikk() {
  const { data } = useMotebehovQuery();
  const hasMotebehov = data.length > 0;

  return (
    <Box background="surface-default" padding="6">
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
