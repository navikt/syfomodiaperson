import React, { useState } from "react";
import {
  fjerneDuplikatInnsendereMotebehov,
  hentSistBehandletMotebehov,
  motebehovlisteMedKunJaSvar,
  motebehovUbehandlet,
  toMotebehovTilbakemeldingDTO,
} from "@/utils/motebehovUtils";
import { toDatePrettyPrint } from "@/utils/datoUtils";
import { useBehandleMotebehov } from "@/data/motebehov/useBehandleMotebehov";
import {
  BodyShort,
  Button,
  Radio,
  RadioGroup,
  ReadMore,
  VStack,
} from "@navikt/ds-react";
import { useBehandleMotebehovAndSendTilbakemelding } from "@/data/motebehov/useBehandleMotebehovAndSendTilbakemelding";
import { SkjemaInnsendingFeil } from "@/components/SkjemaInnsendingFeil";
import { useMotebehovQuery } from "@/data/motebehov/motebehovQueryHooks";
import { CheckmarkCircleFillIcon } from "@navikt/aksel-icons";

const texts = {
  fjernOppgave: "Jeg har vurdert behovet. Oppgaven kan fjernes fra oversikten.",
  radioLegend: "Vurder møtebehov og fjern oppgaven",
  vurdertUtenTilbakemelding: "Jeg har vurdert møtebehovet",
  vurdertMedTilbakemelding:
    "Jeg har vurdert møtebehovet og vil gi tilbakemelding til innmelder(e)",
  tilbakemeldingHeader:
    "Vi sender en automatisk tilbakemelding til innmelder. Klikk her om du vil se hele teksten.",
  tilbakemelding:
    "Vi har mottatt ditt ønske om dialogmøte med Nav. Vi vurderer at det på nåværende tidspunkt ikke er aktuelt at Nav kaller inn til et dialogmøte. Du kan når som helst melde inn et nytt behov i sykefraværsperioden.",
};

export default function BehandleMotebehovKnapp() {
  const { data: motebehovData } = useMotebehovQuery();
  const motebehovListe = motebehovlisteMedKunJaSvar(motebehovData);
  const sistBehandletMotebehov = hentSistBehandletMotebehov(motebehovListe);
  const ubehandledeMotebehov = motebehovUbehandlet(motebehovListe);
  const unikeInnsendereUbehandledeMotebehov =
    fjerneDuplikatInnsendereMotebehov(ubehandledeMotebehov);

  const behandleMotebehov = useBehandleMotebehov();
  const behandleMotebehovAndSendTilbakemelding =
    useBehandleMotebehovAndSendTilbakemelding();
  const [isTilbakemelding, setIsTilbakemelding] = useState(false);

  const tilbakemeldinger = unikeInnsendereUbehandledeMotebehov.map(
    (motebehov) => toMotebehovTilbakemeldingDTO(motebehov, texts.tilbakemelding)
  );

  return ubehandledeMotebehov.length !== 0 ? (
    <VStack className="flex gap-4">
      <RadioGroup
        defaultValue={false}
        size="small"
        legend={texts.radioLegend}
        onChange={(value) => setIsTilbakemelding(value)}
      >
        <Radio value={false}>{texts.vurdertUtenTilbakemelding}</Radio>
        <Radio value={true}>{texts.vurdertMedTilbakemelding}</Radio>
        {isTilbakemelding && (
          <ReadMore size="small" header={texts.tilbakemeldingHeader}>
            {texts.tilbakemelding}
          </ReadMore>
        )}
      </RadioGroup>
      {(behandleMotebehov.isError ||
        behandleMotebehovAndSendTilbakemelding.isError) && (
        <SkjemaInnsendingFeil
          error={
            behandleMotebehov.error ||
            behandleMotebehovAndSendTilbakemelding.isError
          }
        />
      )}
      <Button
        className="w-max"
        loading={
          behandleMotebehovAndSendTilbakemelding.isPending ||
          behandleMotebehov.isPending
        }
        onClick={() => {
          if (isTilbakemelding) {
            behandleMotebehovAndSendTilbakemelding.mutate(tilbakemeldinger);
          } else {
            behandleMotebehov.mutate();
          }
        }}
      >
        Send
      </Button>
    </VStack>
  ) : sistBehandletMotebehov ? (
    <div className="flex flex-row gap-1 items-center">
      <CheckmarkCircleFillIcon
        fontSize="2em"
        color="var(--a-icon-success)"
        title="suksess-ikon"
      />
      <BodyShort size="small">
        {`Møtebehovet ble behandlet av ${
          sistBehandletMotebehov?.behandletVeilederIdent
        } den ${toDatePrettyPrint(
          sistBehandletMotebehov?.behandletTidspunkt
        )}.`}
      </BodyShort>
    </div>
  ) : null;
}
