import React, { useState } from "react";
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
import { useDialogmotekandidat } from "@/data/dialogmotekandidat/dialogmotekandidatQueryHooks";

const texts = {
  title: "Møtebehovhistorikk",
  subtitle: "Oversikt over svar og innmeldte møtebehov",
  ingenSvarHistorikk: "Ingen tidligere møtebehov",
  ingenSvarKandidat: "Kandidat har ikke svart på møtebehov",
};

function MotebehovHistorikkEvent({
  motebehov,
}: {
  motebehov: MotebehovVeilederDTO;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const isArbeidstaker = isArbeidstakerMotebehov(motebehov);
  const headerText = `Møtebehov fra ${
    isArbeidstaker ? "den sykmeldte" : "nærmeste leder"
  } ${tilLesbarDatoMedArstall(motebehov.opprettetDato)}`;
  const isBehandlet =
    motebehov.behandletTidspunkt && motebehov.behandletVeilederIdent;

  const handleAccordionClick = () => setIsOpen(!isOpen);

  return (
    <Accordion.Item open={isOpen}>
      <Accordion.Header onClick={handleAccordionClick}>
        {headerText}
      </Accordion.Header>
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
  const motebehovList = useMotebehovQuery();
  const dialogmotekandidat = useDialogmotekandidat();
  const hasMotebehov = motebehovList.data.length > 0;

  return (
    <Box background="default" padding="space-24">
      <DialogmoteHistorikkHeader
        title={texts.title}
        subtitle={texts.subtitle}
      />
      {hasMotebehov ? (
        <Accordion>
          {motebehovList.data.map((motebehov, index) => (
            <MotebehovHistorikkEvent key={index} motebehov={motebehov} />
          ))}
        </Accordion>
      ) : (
        <BodyShort>
          {dialogmotekandidat.isKandidat
            ? texts.ingenSvarKandidat
            : texts.ingenSvarHistorikk}
        </BodyShort>
      )}
    </Box>
  );
}
