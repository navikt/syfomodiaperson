import { Link, Navigate } from "react-router-dom";

import { useValgtPersonident } from "@/hooks/useValgtBruker";
import { validerKlokkeslett, validerVideoLink } from "@/utils/valideringUtils";
import { useTidStedDocument } from "@/hooks/dialogmote/document/useTidStedDocument";
import {
  DialogmoteDTO,
  EndreDialogmoteDTO,
} from "@/sider/dialogmoter/types/dialogmoteTypes";
import { moteoversiktRoutePath } from "@/AppRouter";
import { useEndreTidStedDialogmote } from "@/sider/dialogmoter/hooks/useEndreTidStedDialogmote";
import { SkjemaInnsendingFeil } from "@/components/SkjemaInnsendingFeil";
import { useSkjemaValuesToDto } from "@/hooks/dialogmote/useSkjemaValuesToDto";
import { TidStedSkjemaValues } from "@/sider/dialogmoter/types/skjemaTypes";
import { Alert, Box, Button, Label } from "@navikt/ds-react";
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
import { DialogmoteInnkallingBehandler } from "../innkalling/DialogmoteInnkallingBehandler";
import { useState } from "react";
import { BehandlerDTO } from "@/data/behandler/BehandlerDTO";
import { behandlerNavn } from "@/utils/behandlerUtils";
import { useInnkallingDocument } from "@/hooks/dialogmote/document/useInnkallingDocument";

export const texts = {
  send: "Send",
  avbryt: "Avbryt",
  begrunnelseArbeidsgiver: "Begrunnelse til nærmeste leder",
  begrunnelseArbeidstaker: "Begrunnelse til arbeidstakeren",
  begrunnelseBehandler: "Begrunnelse til behandler",
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

export interface EndreTidStedSkjemaValues extends TidStedSkjemaValues {
  begrunnelseArbeidsgiver: string;
  begrunnelseArbeidstaker: string;
  begrunnelseBehandler?: string;
}

interface Props {
  dialogmote: DialogmoteDTO;
}

export default function EndreDialogmoteSkjema({ dialogmote }: Props) {
  const { sted, arbeidsgiver, tid, uuid, behandler, videoLink } = dialogmote;
  const fnr = useValgtPersonident();
  const { currentLedere } = useLedereQuery();
  const innkallingDocument = useInnkallingDocument();

  const [selectedBehandler, setSelectedBehandler] = useState<
    BehandlerDTO | undefined
  >(undefined);

  const narmesteLeder = narmesteLederForVirksomhet(
    currentLedere,
    arbeidsgiver.virksomhetsnummer,
  );

  const endreTidStedDialogmote = useEndreTidStedDialogmote(fnr, uuid);

  const {
    getTidStedDocumentArbeidstaker,
    getTidStedDocumentArbeidsgiver,
    getTidStedDocumentBehandler,
  } = useTidStedDocument(dialogmote);
  const { toTidStedDto } = useSkjemaValuesToDto();

  const methods = useForm<EndreTidStedSkjemaValues>({
    defaultValues: {
      dato: tid.split("T")[0],
      klokkeslett: tid.split("T")[1].substring(0, 5),
      sted,
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

  function toEndreTidSted(
    values: EndreTidStedSkjemaValues,
  ): EndreDialogmoteDTO {
    const endreTidStedDto: EndreDialogmoteDTO = {
      ...toTidStedDto(values),
      arbeidstaker: {
        begrunnelse: values.begrunnelseArbeidstaker,
        endringsdokument: getTidStedDocumentArbeidstaker(values),
      },
      arbeidsgiver: {
        begrunnelse: values.begrunnelseArbeidsgiver,
        endringsdokument: getTidStedDocumentArbeidsgiver(values),
      },
    };
    if (behandler) {
      endreTidStedDto.behandler = {
        begrunnelse: values.begrunnelseBehandler || "",
        moteDokument: getTidStedDocumentBehandler(values),
      };
    }
    if (selectedBehandler) {
      endreTidStedDto.behandler = {
        begrunnelse: values.begrunnelseBehandler || "",
        moteDokument: innkallingDocument.getInnkallingDocumentBehandler(values),
        behandler: {
          personIdent: selectedBehandler.fnr,
          behandlerRef: selectedBehandler.behandlerRef,
          behandlerNavn: behandlerNavn(selectedBehandler),
          behandlerKontor: selectedBehandler.kontor ?? "",
        },
      };
    }

    return endreTidStedDto;
  }

  const submit = (values: EndreTidStedSkjemaValues) => {
    const dialogmoteEndring = toEndreTidSted(values);
    endreTidStedDialogmote.mutate(dialogmoteEndring);
  };

  if (endreTidStedDialogmote.isSuccess) {
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
            <div>
              <Label size="small">Behandler</Label>
              {behandler.behandlerNavn}
            </div>
          ) : (
            <DialogmoteInnkallingBehandler
              setSelectedBehandler={setSelectedBehandler}
              selectedbehandler={selectedBehandler}
            />
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
                getTidStedDocumentArbeidstaker(getValues())
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
                getTidStedDocumentArbeidsgiver(getValues())
              }
              title={texts.forhandsvisningArbeidsgiverTitle}
            />
          </div>
          {behandler && (
            <div>
              <TextareaField
                {...register("begrunnelseBehandler", {
                  maxLength: MAX_LENGTH_ENDRE_BEGRUNNELSE,
                  required: texts.begrunnelseBehandlerMissing,
                })}
                value={watch("begrunnelseBehandler")}
                error={errors.begrunnelseBehandler?.message}
                label={texts.begrunnelseBehandler}
                maxLength={MAX_LENGTH_ENDRE_BEGRUNNELSE}
              />
              <Forhandsvisning
                contentLabel={texts.forhandsvisningBehandlerContentLabel}
                getDocumentComponents={() =>
                  getTidStedDocumentBehandler(getValues())
                }
                title={texts.forhandsvisningBehandlerTitle}
              />
            </div>
          )}
          {endreTidStedDialogmote.isError && (
            <SkjemaInnsendingFeil error={endreTidStedDialogmote.error} />
          )}
          <div className="flex gap-4">
            <Button
              type="submit"
              variant="primary"
              loading={endreTidStedDialogmote.isPending}
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
