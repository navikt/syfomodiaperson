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
import { useLedereQuery } from "@/data/leder/ledereQueryHooks";

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

  const { getCurrentNarmesteLeder } = useLedereQuery();

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

    const outro1 = behandler
      ? endreTidStedTexts.arbeidsgiver.outro1WithBehandler
      : endreTidStedTexts.arbeidsgiver.outro1;
    const outro2 = behandler
      ? addBehandlerTypeAndName(
          endreTidStedTexts.arbeidsgiver.outro2WithBehandler,
          behandler
        )
      : endreTidStedTexts.arbeidsgiver.outro2;
    const outro3 = behandler
      ? endreTidStedTexts.arbeidsgiver.outro3WithBehandler
      : endreTidStedTexts.arbeidsgiver.outro3;

    documentComponents.push(
      createParagraph(outro1),
      createParagraph(endreTidStedTexts.arbeidsgiver.outroObligatorisk),
      createParagraph(outro2),
      createParagraphWithTitle(
        endreTidStedTexts.arbeidsgiver.outro3Title,
        outro3
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

    const outro1 = behandler
      ? endreTidStedTexts.arbeidstaker.outro1WithBehandler
      : endreTidStedTexts.arbeidstaker.outro1;
    const outro2 = behandler
      ? addBehandlerTypeAndName(
          endreTidStedTexts.arbeidstaker.outro2WithBehandler,
          behandler
        )
      : endreTidStedTexts.arbeidstaker.outro2;
    const outro3 = behandler
      ? endreTidStedTexts.arbeidstaker.outro3WithBehandler
      : endreTidStedTexts.arbeidstaker.outro3;

    documentComponents.push(
      createParagraph(outro1),
      createParagraph(endreTidStedTexts.arbeidstaker.outroObligatorisk),
      createParagraph(outro2),
      createParagraphWithTitle(
        endreTidStedTexts.arbeidstaker.outro3Title,
        outro3
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
      createParagraph(endreTidStedTexts.behandler.outroObligatorisk),
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
