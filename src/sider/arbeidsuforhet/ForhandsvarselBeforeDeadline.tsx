import React from "react";
import { useArbeidsuforhetVurderingQuery } from "@/data/arbeidsuforhet/arbeidsuforhetQueryHooks";
import { Alert, Box, Button, Heading } from "@navikt/ds-react";
import { ButtonRow } from "@/components/Layout";
import { VisBrev } from "@/components/VisBrev";
import { tilLesbarDatoMedArUtenManedNavn } from "@/utils/datoUtils";
import { ClockIcon } from "@navikt/aksel-icons";

const texts = {
  title: "Venter på svar fra bruker",
  sentAlert: {
    isSent: (sentDate: Date) =>
      `Forhåndsvarselet er sendt ${tilLesbarDatoMedArUtenManedNavn(sentDate)}.`,
    passert:
      "Når fristen er passert vil det dukke opp en hendelse i oversikten.",
  },
  isPassert: "Tiden har gått ut på forhåndsvarselet.",
  sendtInfo:
    "Om du får svar fra bruker, og hen oppfyller kravene om 8-4 etter din vurdering, klikker du på “oppfylt”-knappen under. Om ikke må du vente til tiden går ut før du kan gi avslag.",
  passertInfo: "Tiden har gått ut og du kan nå gå videre med å sende avslag.",
  seSendtBrev: "Se sendt brev",
  oppfylt: "Oppfylt",
  avslag: "Avslag",
  frist: "Fristen går ut: ",
};

export const ForhandsvarselBeforeDeadline = () => {
  const { data } = useArbeidsuforhetVurderingQuery();
  const forhandsvarsel = data[0];
  const frist = forhandsvarsel.varsel?.svarfrist;
  const isOppfyltEnabled = false;

  return (
    <div>
      <Alert variant="success" className="mb-2">
        <p className="mb-0">
          {texts.sentAlert.isSent(forhandsvarsel.createdAt)}
        </p>
        <p>{texts.sentAlert.passert}</p>
      </Alert>
      <Box background="surface-default" padding="3" className="mb-2">
        <div className="flex items-center">
          <Heading className="mt-2 mb-4" level="2" size="small">
            {texts.title}
          </Heading>
          <div className="ml-auto mr-4">
            <b>{texts.frist}</b>
            <span>{tilLesbarDatoMedArUtenManedNavn(frist)}</span>
          </div>
          <ClockIcon title="klokkeikon" fontSize="2em" />
        </div>
        <p>{texts.sendtInfo}</p>
        <ButtonRow>
          <Button variant="primary" disabled>
            {texts.avslag}
          </Button>
          {isOppfyltEnabled && (
            <Button variant="secondary">{texts.oppfylt}</Button>
          )}
          <VisBrev document={forhandsvarsel.document} />
        </ButtonRow>
      </Box>
    </div>
  );
};
