import { EndreTidStedSkjemaValues } from "@/components/dialogmote/endre/EndreDialogmoteSkjema";
import {
  createLink,
  createParagraph,
  createParagraphWithTitle,
} from "@/utils/documentComponentUtils";
import {
  tilDatoMedManedNavnOgKlokkeslettWithComma,
  tilDatoMedUkedagOgManedNavnOgKlokkeslett,
} from "@/utils/datoUtils";
import { genererDato } from "../../components/mote/utils";
import { useForhandsvisningHilsen } from "./useForhandsvisningHilsen";
import {
  commonTexts,
  endreTidStedTexts,
  innkallingTexts,
} from "@/data/dialogmote/dialogmoteTexts";
import {
  DialogmotedeltakerBehandlerDTO,
  DialogmoteDTO,
  DocumentComponentDto,
} from "@/data/dialogmote/types/dialogmoteTypes";
import { useForhandsvisningIntro } from "@/hooks/dialogmote/useForhandsvisningIntro";
import { behandlerDeltakerTekst } from "@/utils/behandlerUtils";
import { useLedere } from "@/hooks/useLedere";

export interface ForhandsvisTidStedGenerator {
  generateArbeidsgiverTidStedDocument(
    values: Partial<EndreTidStedSkjemaValues>
  ): DocumentComponentDto[];

  generateArbeidstakerTidStedDocument(
    values: Partial<EndreTidStedSkjemaValues>
  ): DocumentComponentDto[];

  generateBehandlerTidStedDocument(
    values: Partial<EndreTidStedSkjemaValues>
  ): DocumentComponentDto[];
}

export const useForhandsvisTidSted = (
  dialogmote: DialogmoteDTO
): ForhandsvisTidStedGenerator => {
  const { tid, arbeidsgiver, behandler } = dialogmote;

  const hilsen = useForhandsvisningHilsen();
  const {
    introHilsenArbeidstaker,
    introHilsenArbeidsgiver,
    introHilsenBehandler,
  } = useForhandsvisningIntro();

  const sendtDato = createParagraph(
    `Sendt ${tilDatoMedManedNavnOgKlokkeslettWithComma(new Date())}`
  );

  const { getCurrentNarmesteLeder } = useLedere();

  const getValgtArbeidsgiver = () =>
    getCurrentNarmesteLeder(arbeidsgiver.virksomhetsnummer)?.virksomhetsnavn;

  const generateArbeidsgiverTidStedDocument = (
    values: Partial<EndreTidStedSkjemaValues>
  ) => {
    const documentComponents = [
      sendtDato,
      introHilsenArbeidsgiver,
      ...fellesInfo(values, tid, getValgtArbeidsgiver()),
    ];

    if (values.begrunnelseArbeidsgiver) {
      documentComponents.push(createParagraph(values.begrunnelseArbeidsgiver));
    }

    if (behandler) {
      documentComponents.push(
        createParagraph(endreTidStedTexts.arbeidsgiver.outro1WithBehandler),
        createParagraph(
          addBehandlerTypeAndName(
            endreTidStedTexts.arbeidsgiver.outro2WithBehandler,
            behandler
          )
        )
      );
    } else {
      documentComponents.push(
        createParagraph(endreTidStedTexts.arbeidsgiver.outro1),
        createParagraph(endreTidStedTexts.arbeidsgiver.outro2)
      );
    }

    documentComponents.push(
      createParagraphWithTitle(
        endreTidStedTexts.preMeetingTitle,
        endreTidStedTexts.preMeeting
      ),
      ...hilsen,
      createParagraph(
        commonTexts.arbeidsgiverTlfLabel,
        commonTexts.arbeidsgiverTlf
      )
    );

    return documentComponents;
  };

  const generateArbeidstakerTidStedDocument = (
    values: Partial<EndreTidStedSkjemaValues>
  ) => {
    const documentComponents = [
      sendtDato,
      introHilsenArbeidstaker,
      ...fellesInfo(values, tid, getValgtArbeidsgiver()),
    ];

    if (values.begrunnelseArbeidstaker) {
      documentComponents.push(createParagraph(values.begrunnelseArbeidstaker));
    }

    if (behandler) {
      documentComponents.push(
        createParagraph(endreTidStedTexts.arbeidstaker.outro1WithBehandler),
        createParagraph(
          addBehandlerTypeAndName(
            endreTidStedTexts.arbeidstaker.outro2WithBehandler,
            behandler
          )
        )
      );
    } else {
      documentComponents.push(
        createParagraph(endreTidStedTexts.arbeidstaker.outro1),
        createParagraph(endreTidStedTexts.arbeidstaker.outro2)
      );
    }

    documentComponents.push(
      createParagraphWithTitle(
        endreTidStedTexts.preMeetingTitle,
        endreTidStedTexts.preMeeting
      ),
      ...hilsen
    );

    return documentComponents;
  };

  const generateBehandlerTidStedDocument = (
    values: Partial<EndreTidStedSkjemaValues>
  ) => {
    const documentComponents = [
      sendtDato,
      introHilsenBehandler,
      ...fellesInfo(values, tid, getValgtArbeidsgiver()),
    ];

    if (values.begrunnelseBehandler) {
      documentComponents.push(createParagraph(values.begrunnelseBehandler));
    }

    documentComponents.push(
      createParagraph(endreTidStedTexts.behandler.outro1),
      createParagraph(endreTidStedTexts.behandler.outro2),
      ...hilsen
    );

    return documentComponents;
  };

  return {
    generateArbeidstakerTidStedDocument,
    generateArbeidsgiverTidStedDocument,
    generateBehandlerTidStedDocument,
  };
};

const fellesInfo = (
  values: Partial<EndreTidStedSkjemaValues>,
  opprinneligTid: string,
  arbeidsgiver?: string
): DocumentComponentDto[] => {
  const { dato, klokkeslett, sted, videoLink } = values;

  const components = [
    createParagraph(
      `${endreTidStedTexts.intro1} ${tilDatoMedManedNavnOgKlokkeslettWithComma(
        opprinneligTid
      )}.`
    ),
    createParagraph(endreTidStedTexts.intro2),
    createParagraphWithTitle(
      endreTidStedTexts.moteTidTitle,
      dato && klokkeslett
        ? tilDatoMedUkedagOgManedNavnOgKlokkeslett(
            genererDato(dato, klokkeslett)
          )
        : ""
    ),
    createParagraphWithTitle(endreTidStedTexts.moteStedTitle, sted || ""),
  ];

  if (videoLink) {
    components.push(createLink(innkallingTexts.videoLinkTitle, videoLink));
  }

  if (arbeidsgiver) {
    components.push(createParagraphWithTitle("Arbeidsgiver", arbeidsgiver));
  }

  return components;
};

const addBehandlerTypeAndName = (
  preText: string,
  behandler: DialogmotedeltakerBehandlerDTO
) => {
  return `${behandlerDeltakerTekst(preText, behandler)}.`;
};
