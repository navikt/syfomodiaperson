import {
  Alert,
  BodyLong,
  Box,
  Button,
  Heading,
  List,
  Radio,
  RadioGroup,
  ReadMore,
} from "@navikt/ds-react";
import { PaperplaneIcon } from "@navikt/aksel-icons";
import React from "react";
import { useValgtPersonident } from "@/hooks/useValgtBruker";
import { NarmesteLederRelasjonDTO } from "@/data/leder/ledereTypes";
import {
  NewOppfolgingsplanForesporselDTO,
  useGetOppfolgingsplanForesporselQuery,
  usePostOppfolgingsplanForesporsel,
} from "@/sider/oppfolgingsplan/hooks/oppfolgingsplanForesporselHooks";
import { tilLesbarDatoMedArUtenManedNavn } from "@/utils/datoUtils";
import {
  isDateInOppfolgingstilfelle,
  OppfolgingstilfelleDTO,
} from "@/data/oppfolgingstilfelle/person/types/OppfolgingstilfellePersonDTO";
import { useOppfolgingsplanForesporselDocument } from "@/hooks/oppfolgingsplan/useOppfolgingsplanForesporselDocument";
import LabelAndText from "@/components/LabelAndText";
import { Controller, useForm } from "react-hook-form";
import { useVirksomhetQuery } from "@/data/virksomhet/virksomhetQueryHooks";
import { SkjemaInnsendingFeil } from "@/components/SkjemaInnsendingFeil";
import { ListItem } from "@navikt/ds-react/List";

const texts = {
  aktivForesporsel: "Obs! Det ble bedt om oppfølgingsplan fra",
  header: "Be om oppfølgingsplan",
  description: {
    info1: "Her kan du be om oppfølgingsplan fra arbeidsgiver.",
    info2:
      "Forespørselen blir journalført og vil være tilgjengelig for den sykmeldte på innloggede sider.",
    info3: "Nærmeste leder vil motta et varsel på e-post.",
  },
  virksomhet: "Virksomhet:",
  missingVirksomhet: "Vennligst velg arbeidsgiver",
  narmesteLeder: "Nærmeste leder:",
  button: "Send forespørsel",
  foresporselSendt: "Forespørsel om oppfølgingsplan sendt",
  readMoreText: "Dette får nærmeste leder tilsendt i e-posten fra Nav",
  readMoreContent: {
    hei: "Hei,",
    navBerOm:
      "Nav ber om at du sender inn oppfølgingsplan for en av dine ansatte som er sykmeldt.",
    slikGjorDuDet: "Slik gjør du det:",
    steg1: "Logg inn på 'Min side - arbeidsgiver'.",
    steg2:
      "Klikk på 'bjella'. Der finner du meldingen om å lage oppfølgingsplan.",
    harDuSporsmal: "Har du spørsmål, kan du kontakte oss på 55 55 33 36.",
    duKanIkkeSvare: "Du kan ikke svare på denne meldingen.",
    vennligHilsen: "Vennlig hilsen Nav.",
  },
};

function ReadMoreContent() {
  return (
    <>
      <BodyLong size="small">{texts.readMoreContent.hei}</BodyLong>
      <BodyLong size="small" className="mb-4">
        {texts.readMoreContent.navBerOm}
      </BodyLong>
      <Heading size="xsmall" level="4">
        {texts.readMoreContent.slikGjorDuDet}
      </Heading>
      <List as="ol" size="small" className="mb-4">
        <List.Item>{texts.readMoreContent.steg1}</List.Item>
        <ListItem>{texts.readMoreContent.steg2}</ListItem>
      </List>
      <BodyLong size="small">{texts.readMoreContent.harDuSporsmal}</BodyLong>
      <BodyLong size="small">{texts.readMoreContent.duKanIkkeSvare}</BodyLong>
      <BodyLong size="small">{texts.readMoreContent.vennligHilsen}</BodyLong>
    </>
  );
}

interface Props {
  activeNarmesteLedere: NarmesteLederRelasjonDTO[];
  currentOppfolgingstilfelle: OppfolgingstilfelleDTO;
}

interface FormValues {
  narmesteLeder: NarmesteLederRelasjonDTO;
}

export default function BeOmOppfolgingsplan({
  activeNarmesteLedere,
  currentOppfolgingstilfelle,
}: Props) {
  const personident = useValgtPersonident();
  const { data } = useGetOppfolgingsplanForesporselQuery();
  const lastForesporsel = data?.[0];
  const { virksomhetsnavn: lastForesporselVirksomhetsnavn } =
    useVirksomhetQuery(lastForesporsel?.virksomhetsnummer ?? "");
  const postOppfolgingsplanForesporsel = usePostOppfolgingsplanForesporsel();
  const { getForesporselDocument } = useOppfolgingsplanForesporselDocument();
  const defaultNarmesteLeder =
    activeNarmesteLedere.length === 1 ? activeNarmesteLedere[0] : undefined;
  const { control, watch, handleSubmit } = useForm<FormValues>({
    defaultValues: {
      narmesteLeder: defaultNarmesteLeder,
    },
  });
  const narmesteLeder = watch("narmesteLeder");
  const lastForesporselCreatedAt = lastForesporsel?.createdAt;
  const isAktivForesporsel =
    !!lastForesporselCreatedAt && !postOppfolgingsplanForesporsel.isSuccess
      ? isDateInOppfolgingstilfelle(
          lastForesporselCreatedAt,
          currentOppfolgingstilfelle,
        )
      : false;

  const aktivForesporselTekst = `${texts.aktivForesporsel} ${
    lastForesporselVirksomhetsnavn ?? lastForesporsel?.virksomhetsnummer
  } ${tilLesbarDatoMedArUtenManedNavn(lastForesporselCreatedAt)}`;

  function submit(values: FormValues) {
    const foresporsel: NewOppfolgingsplanForesporselDTO = {
      arbeidstakerPersonident: personident,
      virksomhetsnummer: values.narmesteLeder.virksomhetsnummer,
      narmestelederPersonident:
        values.narmesteLeder.narmesteLederPersonIdentNumber,
      document: getForesporselDocument({
        narmesteLeder: values.narmesteLeder.narmesteLederNavn,
        virksomhetNavn: values.narmesteLeder.virksomhetsnavn,
      }),
    };
    postOppfolgingsplanForesporsel.mutate(foresporsel);
  }

  return (
    <form onSubmit={handleSubmit(submit)}>
      {isAktivForesporsel && (
        <Alert variant="warning" className="mb-2">
          {aktivForesporselTekst}
        </Alert>
      )}
      <Box background="default" className="mb-4 flex flex-col p-4 gap-4">
        <Heading size="small" level="3">
          {texts.header}
        </Heading>
        <div>
          <BodyLong>{texts.description.info1}</BodyLong>
          <BodyLong>{texts.description.info2}</BodyLong>
        </div>
        {!defaultNarmesteLeder && (
          <Controller
            name="narmesteLeder"
            control={control}
            rules={{ required: texts.missingVirksomhet }}
            render={({ field, fieldState: { error } }) => (
              <RadioGroup
                name="narmesteLeder"
                size="small"
                legend="Arbeidsgiver"
                error={error?.message}
                value={field.value?.uuid}
                onChange={(value) => {
                  const selectedNarmesteLeder = activeNarmesteLedere.find(
                    (nl) => nl.uuid === value,
                  );
                  field.onChange(selectedNarmesteLeder);
                }}
              >
                {activeNarmesteLedere.map(
                  ({ virksomhetsnavn, uuid }, index) => (
                    <Radio key={index} value={uuid}>
                      {virksomhetsnavn}
                    </Radio>
                  ),
                )}
              </RadioGroup>
            )}
          />
        )}
        {narmesteLeder && (
          <div>
            <LabelAndText
              label={texts.virksomhet}
              text={narmesteLeder.virksomhetsnavn}
            />
            <LabelAndText
              label={texts.narmesteLeder}
              text={narmesteLeder.narmesteLederNavn}
            />
          </div>
        )}
        <div>
          <BodyLong>{texts.description.info3}</BodyLong>
          <ReadMore header={texts.readMoreText}>
            <ReadMoreContent />
          </ReadMore>
        </div>
        {postOppfolgingsplanForesporsel.isSuccess ? (
          <Alert inline variant="success">
            {texts.foresporselSendt}
          </Alert>
        ) : (
          <Button
            type="submit"
            className="w-fit"
            loading={postOppfolgingsplanForesporsel.isPending}
            icon={<PaperplaneIcon />}
          >
            {texts.button}
          </Button>
        )}
        {postOppfolgingsplanForesporsel.isError && (
          <SkjemaInnsendingFeil error={postOppfolgingsplanForesporsel.error} />
        )}
      </Box>
    </form>
  );
}
