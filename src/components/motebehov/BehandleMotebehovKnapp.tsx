import React, { useState } from "react";
import {
  fjerneDuplikatInnsendereMotebehov,
  getMotebehovInActiveTilfelle,
  hentSistBehandletMotebehov,
  motebehovlisteMedKunJaSvar,
  motebehovUbehandlet,
  toMotebehovTilbakemeldingDTO,
} from "@/utils/motebehovUtils";
import { toDatePrettyPrint } from "@/utils/datoUtils";
import { useVurderMotebehov } from "@/data/motebehov/useVurderMotebehov";
import {
  BodyShort,
  Button,
  Radio,
  RadioGroup,
  ReadMore,
  VStack,
} from "@navikt/ds-react";
import { SkjemaInnsendingFeil } from "@/components/SkjemaInnsendingFeil";
import { useMotebehovQuery } from "@/data/motebehov/motebehovQueryHooks";
import { CheckmarkCircleFillIcon } from "@navikt/aksel-icons";
import { useOppfolgingstilfellePersonQuery } from "@/data/oppfolgingstilfelle/person/oppfolgingstilfellePersonQueryHooks";
import { MotebehovSkjemaType } from "@/data/motebehov/types/motebehovTypes";
import HjelpetekstVedMeldtBehov from "@/components/motebehov/HjelpetekstVedMeldtBehov";

const texts = {
  fjernOppgave: "Jeg har vurdert behovet. Oppgaven kan fjernes fra oversikten.",
  radioLegend: "Vurder behov for dialogmøte",
  vurderBehovForDialogmoteRadioBtn: "Behov for dialogmøte",
  vurderBehovForDialogmoteRadioBtnDescription:
    "Krever at man manuelt sender en innkalling til dialogmøte etterpå.",
  vurderIkkeBehovForDialogmoteRadioBtn: "Ikke behov for dialogmøte",
  vurderIkkeBehovForDialogmoteRadioBtnDescription:
    "Sender en automatisk tilbakemelding til innmelder(e) at det ikke er behov for dialogmøte.",
  tilbakemeldingHeader:
    "Dette er tilbakemeldingen vi sender automatisk til innmelder.",
  tilbakemelding:
    "Etter dialog med deg har vi kommet frem til at Nav ikke kaller inn til dialogmøte på nåværende tidspunkt. Du kan be om dialogmøte senere eller hvis det skjer endringer.",
};

export default function BehandleMotebehovKnapp() {
  const { data: motebehovData } = useMotebehovQuery();
  const { latestOppfolgingstilfelle } = useOppfolgingstilfellePersonQuery();
  const motebehovListe = motebehovlisteMedKunJaSvar(motebehovData);
  const sistBehandletMotebehov = hentSistBehandletMotebehov(motebehovData);
  const isSistBehandletMotebehovInnenforTilfelle = sistBehandletMotebehov
    ? getMotebehovInActiveTilfelle(
        [sistBehandletMotebehov],
        latestOppfolgingstilfelle
      ).length > 0
    : false;
  const ubehandledeMotebehov = motebehovUbehandlet(motebehovListe);
  const unikeInnsendereUbehandledeMotebehov =
    fjerneDuplikatInnsendereMotebehov(ubehandledeMotebehov);

  const vurderMotebehov = useVurderMotebehov();
  const [harMoteBehov, setHarMoteBehov] = useState(false);

  const tilbakemeldinger = unikeInnsendereUbehandledeMotebehov.map(
    (motebehov) => toMotebehovTilbakemeldingDTO(motebehov, texts.tilbakemelding)
  );

  const minstEnHarMeldtBehov = motebehovListe.some(
    (behov) => behov.skjemaType === MotebehovSkjemaType.MELD_BEHOV
  );
  return ubehandledeMotebehov.length !== 0 ? (
    <VStack className="flex gap-4">
      {minstEnHarMeldtBehov && <HjelpetekstVedMeldtBehov />}
      <RadioGroup
        defaultValue={false}
        size="small"
        legend={texts.radioLegend}
        onChange={(value) => setHarMoteBehov(value)}
      >
        <Radio
          value={false}
          description={texts.vurderBehovForDialogmoteRadioBtnDescription}
        >
          {texts.vurderBehovForDialogmoteRadioBtn}
        </Radio>
        <Radio
          value={true}
          description={texts.vurderIkkeBehovForDialogmoteRadioBtnDescription}
        >
          {texts.vurderIkkeBehovForDialogmoteRadioBtn}
        </Radio>
        {harMoteBehov && (
          <ReadMore
            size="small"
            header={
              <BodyShort size="small">{texts.tilbakemeldingHeader}</BodyShort>
            }
            defaultOpen
          >
            {texts.tilbakemelding}
          </ReadMore>
        )}
      </RadioGroup>
      {vurderMotebehov.isError && (
        <SkjemaInnsendingFeil error={vurderMotebehov.error} />
      )}
      <Button
        className="w-max"
        loading={vurderMotebehov.isPending}
        onClick={() => {
          vurderMotebehov.mutate({
            harBehovForMote: harMoteBehov,
            tilbakemeldinger: harMoteBehov ? [] : tilbakemeldinger,
          });
        }}
      >
        Bekreft
      </Button>
    </VStack>
  ) : isSistBehandletMotebehovInnenforTilfelle ? (
    <>
      <div className="flex flex-row gap-1 items-center">
        <CheckmarkCircleFillIcon
          fontSize="2em"
          color="var(--ax-text-success-decoration)"
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
      {minstEnHarMeldtBehov && <HjelpetekstVedMeldtBehov />}
    </>
  ) : null;
}
