import React, { useState } from "react";
import {
  erMotebehovBehandlet,
  fjernBehandledeMotebehov,
  fjerneDuplikatInnsendereMotebehov,
  harUbehandletMotebehov,
  hentSistBehandletMotebehov,
  motebehovlisteMedKunJaSvar,
  toMotebehovTilbakemeldingDTO,
} from "@/utils/motebehovUtils";
import { toDatePrettyPrint } from "@/utils/datoUtils";
import { MotebehovVeilederDTO } from "@/data/motebehov/types/motebehovTypes";
import { useBehandleMotebehov } from "@/data/motebehov/useBehandleMotebehov";
import {
  Box,
  Button,
  Checkbox,
  Radio,
  RadioGroup,
  ReadMore,
  VStack,
} from "@navikt/ds-react";
import { useBehandleMotebehovAndSendTilbakemelding } from "@/data/motebehov/useBehandleMotebehovAndSendTilbakemelding";
import { SkjemaInnsendingFeil } from "@/components/SkjemaInnsendingFeil";
import { useMotebehovQuery } from "@/data/motebehov/motebehovQueryHooks";

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

const behandleMotebehovKnappLabel = (
  erBehandlet: boolean,
  sistBehandletMotebehov?: MotebehovVeilederDTO
): string => {
  return erBehandlet
    ? `Ferdigbehandlet av ${
        sistBehandletMotebehov?.behandletVeilederIdent
      } ${toDatePrettyPrint(sistBehandletMotebehov?.behandletTidspunkt)}`
    : texts.fjernOppgave;
};

export default function BehandleMotebehovKnapp() {
  const { data: motebehovData } = useMotebehovQuery();
  const motebehovListe = motebehovlisteMedKunJaSvar(motebehovData);
  const sistBehandletMotebehov = hentSistBehandletMotebehov(motebehovListe);
  const ubehandledeMotebehov = fjernBehandledeMotebehov(motebehovListe);
  const unikeInnsendereUbehandledeMotebehov =
    fjerneDuplikatInnsendereMotebehov(ubehandledeMotebehov);
  const erBehandlet = erMotebehovBehandlet(motebehovListe);
  const behandleMotebehov = useBehandleMotebehov();
  const behandleMotebehovAndSendTilbakemelding =
    useBehandleMotebehovAndSendTilbakemelding();
  const [isTilbakemelding, setIsTilbakemelding] = useState(false);

  const tilbakemeldinger = unikeInnsendereUbehandledeMotebehov.map(
    (motebehov) => toMotebehovTilbakemeldingDTO(motebehov, texts.tilbakemelding)
  );

  if (!erBehandlet) {
    return (
      <>
        <VStack>
          <RadioGroup
            defaultValue={false}
            size="small"
            legend={texts.radioLegend}
            onChange={(value) => setIsTilbakemelding(value)}
          >
            <Radio value={false}>{texts.vurdertUtenTilbakemelding}</Radio>
            <Radio value={true}>{texts.vurdertMedTilbakemelding}</Radio>
          </RadioGroup>
          {isTilbakemelding && (
            <ReadMore size="small" header={texts.tilbakemeldingHeader}>
              {texts.tilbakemelding}
            </ReadMore>
          )}
        </VStack>
        <div>
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
        </div>
      </>
    );
  }

  return motebehovListe.length > 0 ? (
    <Box borderColor="border-subtle" borderWidth="1" padding="4">
      <Checkbox
        size="small"
        onClick={() => {
          if (harUbehandletMotebehov(motebehovListe)) {
            behandleMotebehov.mutate();
          }
        }}
        disabled={erBehandlet || behandleMotebehov.isPending}
        defaultChecked={erBehandlet}
      >
        {behandleMotebehovKnappLabel(erBehandlet, sistBehandletMotebehov)}
      </Checkbox>
    </Box>
  ) : null;
}
