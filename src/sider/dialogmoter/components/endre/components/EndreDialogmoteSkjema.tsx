import { Link, Navigate } from "react-router-dom";
import { useValgtPersonident } from "@/hooks/useValgtBruker";
import { validerKlokkeslett, validerVideoLink } from "@/utils/valideringUtils";
import { useEndreDocument } from "@/hooks/dialogmote/document/useEndreDocument";
import {
  DialogmoteDTO,
  EndreDialogmoteDTO,
} from "@/sider/dialogmoter/types/dialogmoteTypes";
import { moteoversiktRoutePath } from "@/AppRouter";
import { useEndreDialogmote } from "@/sider/dialogmoter/hooks/useEndreDialogmote";
import { SkjemaInnsendingFeil } from "@/components/SkjemaInnsendingFeil";
import { useSkjemaValuesToDto } from "@/hooks/dialogmote/useSkjemaValuesToDto";
import { EndreSkjemaValues } from "@/sider/dialogmoter/types/skjemaTypes";
import { Alert, Box, Button, Label, VStack } from "@navikt/ds-react";
import { useLedereQuery } from "@/data/leder/ledereQueryHooks";
import { narmesteLederForVirksomhet } from "@/utils/ledereUtils";
import { Forhandsvisning } from "@/components/Forhandsvisning";
import { FormProvider, useForm } from "react-hook-form";
import DialogmoteDato from "@/sider/dialogmoter/components/DialogmoteDato";
import DialogmoteSted, {
  MAX_LENGTH_STED,
} from "@/sider/dialogmoter/components/DialogmoteSted";
import DialogmoteVideolink from "@/sider/dialogmoter/components/DialogmoteVideolink";
import DialogmoteKlokkeslett from "@/sider/dialogmoter/components/DialogmoteKlokkeslett";
import MalformRadioGroup from "@/components/MalformRadioGroup";
import TextareaField from "@/sider/dialogmoter/components/TextareaField";
import DialogmoteFrist from "@/sider/dialogmoter/components/DialogmoteFrist";
import { useInnkallingDocument } from "@/hooks/dialogmote/document/useInnkallingDocument";
import { DialogmoteEndringBehandler } from "@/sider/dialogmoter/components/endre/components/DialogmoteEndringBehandler";
import { behandlerNavn } from "@/utils/behandlerUtils";
import dayjs from "dayjs";

export const texts = {
  send: "Send",
  avbryt: "Avbryt",
  begrunnelseArbeidsgiver: "Begrunnelse til nærmeste leder",
  begrunnelseArbeidstaker: "Begrunnelse til arbeidstakeren",
  begrunnelseBehandler: "Begrunnelse til behandler",
  fritekstBehandler: "Fritekst til behandler (valgfri)",
  forhandsvisningSubtitle: "Endret dialogmøte",
  forhandsvisningArbeidstakerTitle: "Brev til arbeidstakeren",
  forhandsvisningArbeidstakerContentLabel:
    "Forhåndsvis endring av dialogmøte arbeidstaker",
  forhandsvisningArbeidsgiverTitle: "Brev til nærmeste leder",
  forhandsvisningArbeidsgiverContentLabel:
    "Forhåndsvis endring av dialogmøte arbeidsgiver",
  forhandsvisningBehandlerTitle: "Brev til behandler",
  forhandsvisningBehandlerContentLabel:
    "Forhåndsvis endring av dialogmøte behandler",
  noNarmesteleder:
    "Det er ikke registrert en nærmeste leder fra denne arbeidsgiveren, derfor sender vi dette brevet automatisk til " +
    "Altinn. Lederen må registrere seg som nærmeste leder i Altinn for å kunne gi svar på Nav.no.",
  stedMissing: "Vennligst angi møtested",
  begrunnelseArbeidstakerMissing:
    "Vennligst angi begrunnelse til arbeidstakeren",
  begrunnelseArbeidsgiverMissing:
    "Vennligst angi begrunnelse til nærmeste leder",
  begrunnelseBehandlerMissing: "Vennligst angi begrunnelse til behandler",
};

export const MAX_LENGTH_ENDRE_BEGRUNNELSE = 2000;

interface Props {
  dialogmote: DialogmoteDTO;
}

export default function EndreDialogmoteSkjema({ dialogmote }: Props) {
  const { sted, arbeidsgiver, tid, uuid, behandler, videoLink } = dialogmote;
  const fnr = useValgtPersonident();
  const { currentLedere } = useLedereQuery();
  const innkallingDocument = useInnkallingDocument();

  const narmesteLeder = narmesteLederForVirksomhet(
    currentLedere,
    arbeidsgiver.virksomhetsnummer,
  );

  const endreDialogmote = useEndreDialogmote(fnr, uuid);

  const {
    getEndreDocumentArbeidstaker,
    getEndreDocumentArbeidsgiver,
    getEndreDocumentBehandler,
  } = useEndreDocument(dialogmote);
  const { toDialogmoteEndringDto } = useSkjemaValuesToDto();

  const methods = useForm<EndreSkjemaValues>({
    defaultValues: {
      dato: dayjs(tid).format("YYYY-MM-DD"),
      klokkeslett: dayjs(tid).format("HH:mm"),
      sted,
      behandler,
      videoLink,
    },
  });
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
    watch,
  } = methods;

  function toDialogmoteEndring(values: EndreSkjemaValues): EndreDialogmoteDTO {
    const endreDialogmoteDto: EndreDialogmoteDTO = {
      ...toDialogmoteEndringDto(values),
      arbeidstaker: {
        begrunnelse: values.begrunnelseArbeidstaker,
        endringsdokument: getEndreDocumentArbeidstaker(values),
      },
      arbeidsgiver: {
        begrunnelse: values.begrunnelseArbeidsgiver,
        endringsdokument: getEndreDocumentArbeidsgiver(values),
      },
    };
    if (behandler) {
      endreDialogmoteDto.behandler = {
        fritekst: values.fritekstBehandler || "",
        moteDokument: getEndreDocumentBehandler(values),
      };
    }
    const { nyBehandler } = values;
    if (nyBehandler) {
      endreDialogmoteDto.behandler = {
        fritekst: values.fritekstBehandler || "",
        moteDokument: innkallingDocument.getInnkallingDocumentBehandler({
          ...values,
          arbeidsgiver: arbeidsgiver.virksomhetsnummer,
        }),
        deltaker: {
          personIdent: nyBehandler.fnr,
          behandlerRef: nyBehandler.behandlerRef,
          behandlerNavn: behandlerNavn(nyBehandler),
          behandlerKontor: nyBehandler.kontor ?? "",
        },
      };
    }

    return endreDialogmoteDto;
  }

  const submit = (values: EndreSkjemaValues) => {
    const dialogmoteEndring = toDialogmoteEndring(values);
    endreDialogmote.mutate(dialogmoteEndring);
  };

  if (endreDialogmote.isSuccess) {
    return <Navigate to={moteoversiktRoutePath} />;
  }

  return (
    <Box background="default" padding="space-24" className="mb-2">
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(submit)} className="flex flex-col gap-4">
          <MalformRadioGroup />
          <DialogmoteFrist />
          <div className="flex gap-4 items-start">
            <DialogmoteDato />
            <DialogmoteKlokkeslett
              {...register("klokkeslett", {
                validate: (value, formValues) =>
                  validerKlokkeslett(formValues.dato, value),
              })}
              value={watch("klokkeslett")}
              error={errors.klokkeslett?.message}
            />
          </div>
          <DialogmoteSted
            {...register("sted", {
              maxLength: MAX_LENGTH_STED,
              required: texts.stedMissing,
            })}
            value={watch("sted")}
            error={errors.sted?.message}
          />
          <DialogmoteVideolink
            {...register("videoLink", {
              validate: (value) => validerVideoLink(value),
            })}
            value={watch("videoLink")}
            error={errors.videoLink?.message}
          />
          {behandler ? (
            <VStack>
              <Label size="small">Behandler</Label>
              {behandler.behandlerNavn}
            </VStack>
          ) : (
            <DialogmoteEndringBehandler />
          )}
          <div>
            <TextareaField
              {...register("begrunnelseArbeidstaker", {
                maxLength: MAX_LENGTH_ENDRE_BEGRUNNELSE,
                required: texts.begrunnelseArbeidstakerMissing,
              })}
              value={watch("begrunnelseArbeidstaker")}
              error={errors.begrunnelseArbeidstaker?.message}
              label={texts.begrunnelseArbeidstaker}
              maxLength={MAX_LENGTH_ENDRE_BEGRUNNELSE}
            />
            <Forhandsvisning
              contentLabel={texts.forhandsvisningArbeidstakerContentLabel}
              getDocumentComponents={() =>
                getEndreDocumentArbeidstaker(getValues())
              }
              title={texts.forhandsvisningArbeidstakerTitle}
            />
          </div>
          <div>
            <TextareaField
              {...register("begrunnelseArbeidsgiver", {
                maxLength: MAX_LENGTH_ENDRE_BEGRUNNELSE,
                required: texts.begrunnelseArbeidsgiverMissing,
              })}
              value={watch("begrunnelseArbeidsgiver")}
              error={errors.begrunnelseArbeidsgiver?.message}
              label={texts.begrunnelseArbeidsgiver}
              maxLength={MAX_LENGTH_ENDRE_BEGRUNNELSE}
            />
            {!narmesteLeder && (
              <Alert
                variant="warning"
                size="small"
                className="mb-4 [&>*]:max-w-fit"
              >
                {texts.noNarmesteleder}
              </Alert>
            )}
            <Forhandsvisning
              contentLabel={texts.forhandsvisningArbeidsgiverContentLabel}
              getDocumentComponents={() =>
                getEndreDocumentArbeidsgiver(getValues())
              }
              title={texts.forhandsvisningArbeidsgiverTitle}
            />
          </div>
          {(behandler || watch("nyBehandler")) && (
            <div>
              <TextareaField
                {...register("fritekstBehandler", {
                  maxLength: MAX_LENGTH_ENDRE_BEGRUNNELSE,
                  required: texts.begrunnelseBehandlerMissing,
                })}
                value={watch("fritekstBehandler")}
                error={errors.fritekstBehandler?.message}
                label={
                  behandler
                    ? texts.begrunnelseBehandler
                    : texts.fritekstBehandler
                }
                maxLength={MAX_LENGTH_ENDRE_BEGRUNNELSE}
              />
              <Forhandsvisning
                contentLabel={texts.forhandsvisningBehandlerContentLabel}
                getDocumentComponents={() =>
                  behandler
                    ? getEndreDocumentBehandler(getValues())
                    : innkallingDocument.getInnkallingDocumentBehandler({
                        ...getValues(),
                        arbeidsgiver: arbeidsgiver.virksomhetsnummer,
                      })
                }
                title={texts.forhandsvisningBehandlerTitle}
              />
            </div>
          )}
          {endreDialogmote.isError && (
            <SkjemaInnsendingFeil error={endreDialogmote.error} />
          )}
          <div className="flex gap-4">
            <Button
              type="submit"
              variant="primary"
              loading={endreDialogmote.isPending}
            >
              {texts.send}
            </Button>
            <Button
              as={Link}
              type="button"
              variant="tertiary"
              to={moteoversiktRoutePath}
            >
              {texts.avbryt}
            </Button>
          </div>
        </form>
      </FormProvider>
    </Box>
  );
}
