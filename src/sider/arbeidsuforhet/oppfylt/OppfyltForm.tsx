import React, { useState } from "react";
import {
  BodyShort,
  Box,
  Button,
  Heading,
  List,
  Textarea,
} from "@navikt/ds-react";
import { SkjemaInnsendingFeil } from "@/components/SkjemaInnsendingFeil";
import { Forhandsvisning } from "@/components/Forhandsvisning";
import { useForm } from "react-hook-form";
import {
  Oppfylt,
  OppfyltUtenForhandsvarsel,
  VurderingType,
} from "@/sider/arbeidsuforhet/data/arbeidsuforhetTypes";
import { useArbeidsuforhetVurderingDocument } from "@/sider/arbeidsuforhet/hooks/useArbeidsuforhetVurderingDocument";
import { useSaveVurderingArbeidsuforhet } from "@/sider/arbeidsuforhet/hooks/useSaveVurderingArbeidsuforhet";
import { Link, useNavigate } from "react-router-dom";
import { arbeidsuforhetPath } from "@/AppRouter";
import { ButtonRow } from "@/components/Layout";
import { useNotification } from "@/context/notification/NotificationContext";
import { useGetArbeidsuforhetVurderingerQuery } from "@/sider/arbeidsuforhet/hooks/arbeidsuforhetQueryHooks";
import { useDebouncedCallback } from "use-debounce";
import {
  DraftTextDTO,
  useDeleteDraft,
  useSaveDraft,
} from "@/hooks/useDraftQuery";
import { DraftSaveStatus } from "@/components/DraftSaveStatus";

const texts = {
  title: "Skriv innstilling om oppfylt vilkår",
  veiledning: {
    info: "Skriv en kort begrunnelse for hvorfor bruker oppfyller vilkårene i § 8-4, og hvilke opplysninger som ligger til grunn for vurderingen.",
    infoEtterForhandsvarsel:
      "Skriv en kort begrunnelse for hvorfor bruker likevel oppfyller vilkårene i § 8-4, og hvilke opplysninger som ligger til grunn for vurderingen.",
    hvisFriskmeldingTilArbeidsformidling:
      "Hvis du har vurdert ordningen friskmelding til arbeidsformidling, skriv hvorfor ordningen eventuelt er aktuell og legg inn henvisning til §8-5.",
  },
  begrunnelseLabel: "Begrunnelse (obligatorisk)",
  begrunnelseDescription:
    "Åpne forhåndsvisning for å se vurderingen. Når du trykker Lagre journalføres vurderingen automatisk.",
  forDuGarVidere: {
    head: "Før du går videre bør du gjøre følgende:",
    step1: "Informere bruker om utfallet av vurderingen.",
    step2:
      "Besvare Gosys-oppgaven dersom Nav Arbeid og ytelser ba om vurderingen.",
  },
  forhandsvisningLabel: "Forhåndsvis vurderingen",
  missingBegrunnelse: "Vennligst angi begrunnelse",
  journalforButtonText: "Journalfør innstilling",
  avbrytButton: "Avbryt",
  success:
    "Vurderingen om at bruker oppfyller § 8-4 er lagret i historikken og blir journalført automatisk.",
};

const begrunnelseMaxLength = 8000;

function FormInformation({
  isSisteVurderingForhandsvarsel,
}: {
  isSisteVurderingForhandsvarsel: boolean;
}) {
  return isSisteVurderingForhandsvarsel ? (
    <>
      <BodyShort>{texts.veiledning.infoEtterForhandsvarsel}</BodyShort>
      <BodyShort>
        {texts.veiledning.hvisFriskmeldingTilArbeidsformidling}
      </BodyShort>
    </>
  ) : (
    <BodyShort>{texts.veiledning.info}</BodyShort>
  );
}

interface SkjemaValues {
  begrunnelse: string;
}

interface Props {
  begrunnelseUtkast?: string;
}

export default function OppfyltForm({ begrunnelseUtkast }: Props) {
  const navigate = useNavigate();
  const { data } = useGetArbeidsuforhetVurderingerQuery();
  const sisteVurdering = data[0];
  const isSisteVurderingForhandsvarsel =
    sisteVurdering?.type === VurderingType.FORHANDSVARSEL;
  const forhandsvarselSendtDato = sisteVurdering?.varsel?.createdAt;

  const sendVurdering = useSaveVurderingArbeidsuforhet();
  const { getOppfyltDocument, getOppfyltEtterForhandsvarselDocument } =
    useArbeidsuforhetVurderingDocument();
  const { setNotification } = useNotification();
  const [utkastSavedTime, setUtkastSavedTime] = useState<Date>();
  const {
    register,
    watch,
    formState: { errors },
    handleSubmit,
  } = useForm<SkjemaValues>({
    defaultValues: { begrunnelse: begrunnelseUtkast ?? "" },
  });

  const CATEGORY = "arbeidsuforhet-oppfylt";
  const saveDraft = useSaveDraft<DraftTextDTO>(CATEGORY);
  const deleteDraft = useDeleteDraft(CATEGORY);

  const debouncedAutoSaveDraft = useDebouncedCallback((tekst: string) => {
    if (!tekst) {
      return;
    }
    const draftPayload = { begrunnelse: tekst };

    saveDraft.mutate(draftPayload, {
      onSuccess: () => {
        setUtkastSavedTime(new Date());
      },
      onError: () => {
        setUtkastSavedTime(undefined);
      },
    });
  }, 750);

  const submit = (values: SkjemaValues) => {
    const vurderingRequestDTO: Oppfylt | OppfyltUtenForhandsvarsel = {
      type: isSisteVurderingForhandsvarsel
        ? VurderingType.OPPFYLT
        : VurderingType.OPPFYLT_UTEN_FORHANDSVARSEL,
      begrunnelse: values.begrunnelse,
      document: getDocumentComponents(values),
    };
    sendVurdering.mutate(vurderingRequestDTO, {
      onSuccess: () => {
        setUtkastSavedTime(undefined);
        debouncedAutoSaveDraft.cancel();
        deleteDraft.mutate(undefined);
        setNotification({
          message: texts.success,
        });
        navigate(arbeidsuforhetPath);
      },
    });
  };

  function getDocumentComponents(values: SkjemaValues) {
    return isSisteVurderingForhandsvarsel && forhandsvarselSendtDato
      ? getOppfyltEtterForhandsvarselDocument({
          begrunnelse: values.begrunnelse,
          forhandsvarselSendtDato: forhandsvarselSendtDato,
        })
      : getOppfyltDocument({ begrunnelse: values.begrunnelse });
  }

  return (
    <Box background="default" padding="space-24" className="mb-2">
      <form onSubmit={handleSubmit(submit)} className="[&>*]:mb-4">
        <Heading level="2" size="medium">
          {texts.title}
        </Heading>
        <FormInformation
          isSisteVurderingForhandsvarsel={isSisteVurderingForhandsvarsel}
        />
        <Textarea
          {...register("begrunnelse", {
            maxLength: begrunnelseMaxLength,
            required: texts.missingBegrunnelse,
            onChange: (e) => {
              debouncedAutoSaveDraft(e.target.value);
            },
          })}
          value={watch("begrunnelse")}
          label={texts.begrunnelseLabel}
          description={texts.begrunnelseDescription}
          error={errors.begrunnelse?.message}
          size="small"
          minRows={6}
          maxLength={begrunnelseMaxLength}
        />
        <DraftSaveStatus
          isSaveError={saveDraft.isError}
          savedTime={utkastSavedTime}
        />
        {sendVurdering.isError && (
          <SkjemaInnsendingFeil error={sendVurdering.error} />
        )}
        {isSisteVurderingForhandsvarsel ? (
          <div>
            <Heading as="h3" size="xsmall">
              {texts.forDuGarVidere.head}
            </Heading>
            <Box marginBlock="space-12" asChild>
              <List as="ol" size="small">
                <List.Item>{texts.forDuGarVidere.step1}</List.Item>
                <List.Item>{texts.forDuGarVidere.step2}</List.Item>
              </List>
            </Box>
          </div>
        ) : (
          <div>
            <Heading as="h3" size="xsmall">
              {texts.forDuGarVidere.head}
            </Heading>
            <Box marginBlock="space-12" asChild>
              <List as="ul" size="small">
                <List.Item>{texts.forDuGarVidere.step2}</List.Item>
              </List>
            </Box>
          </div>
        )}
        <ButtonRow>
          <Button loading={sendVurdering.isPending} type="submit">
            {texts.journalforButtonText}
          </Button>
          <Forhandsvisning
            contentLabel={texts.forhandsvisningLabel}
            getDocumentComponents={() => getDocumentComponents(watch())}
          />
          <Button as={Link} to={arbeidsuforhetPath} variant="secondary">
            {texts.avbrytButton}
          </Button>
        </ButtonRow>
      </form>
    </Box>
  );
}
