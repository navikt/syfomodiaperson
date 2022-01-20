import { DialogmoteInnkallingSkjemaValues } from "@/components/dialogmote/innkalling/DialogmoteInnkallingSkjema";
import { DocumentComponentDto } from "@/data/dialogmote/types/dialogmoteTypes";
import {
  tilDatoMedManedNavnOgKlokkeslettWithComma,
  tilDatoMedUkedagOgManedNavnOgKlokkeslett,
} from "@/utils/datoUtils";
import { genererDato } from "../../components/mote/utils";
import {
  commonTexts,
  innkallingTexts,
} from "@/data/dialogmote/dialogmoteTexts";
import {
  createLink,
  createParagraph,
  createParagraphWithTitle,
} from "@/utils/documentComponentUtils";
import { useForhandsvisningHilsen } from "./useForhandsvisningHilsen";
import { BehandlerDialogmeldingDTO } from "@/data/behandlerdialogmelding/BehandlerDialogmeldingDTO";
import { capitalizeWord } from "@/utils/stringUtils";
import { behandlerNavn } from "@/utils/behandlerUtils";
import { useForhandsvisningIntro } from "@/hooks/dialogmote/useForhandsvisningIntro";

export interface ForhandsvisInnkallingGenerator {
  generateArbeidstakerInnkallingDocument(
    values: Partial<DialogmoteInnkallingSkjemaValues>,
    valgtBehandler?: BehandlerDialogmeldingDTO
  ): DocumentComponentDto[];

  generateArbeidsgiverInnkallingDocument(
    values: Partial<DialogmoteInnkallingSkjemaValues>,
    valgtBehandler?: BehandlerDialogmeldingDTO
  ): DocumentComponentDto[];

  generateBehandlerInnkallingDocument(
    values: Partial<DialogmoteInnkallingSkjemaValues>
  ): DocumentComponentDto[];
}

export const useForhandsvisInnkalling = (): ForhandsvisInnkallingGenerator => {
  const hilsen = useForhandsvisningHilsen();
  const {
    introHilsenArbeidstaker,
    introHilsenArbeidsgiver,
    introHilsenBehandler,
  } = useForhandsvisningIntro();

  const generateArbeidstakerInnkallingDocument = (
    values: Partial<DialogmoteInnkallingSkjemaValues>,
    valgtBehandler?: BehandlerDialogmeldingDTO
  ) => {
    const documentComponents = [
      ...fellesInfo(values),
      introHilsenArbeidstaker,
      ...arbeidstakerIntro(valgtBehandler),
    ];
    if (values.fritekstArbeidstaker) {
      documentComponents.push(createParagraph(values.fritekstArbeidstaker));
    }
    documentComponents.push(...arbeidstakerOutro(valgtBehandler), ...hilsen);

    return documentComponents;
  };

  const generateArbeidsgiverInnkallingDocument = (
    values: Partial<DialogmoteInnkallingSkjemaValues>,
    valgtBehandler?: BehandlerDialogmeldingDTO
  ) => {
    const documentComponents = [
      ...fellesInfo(values),
      introHilsenArbeidsgiver,
      ...arbeidsgiverIntro(valgtBehandler),
    ];
    if (values.fritekstArbeidsgiver) {
      documentComponents.push(createParagraph(values.fritekstArbeidsgiver));
    }
    documentComponents.push(
      ...arbeidsgiverOutro(valgtBehandler),
      ...hilsen,
      createParagraph(
        commonTexts.arbeidsgiverTlfLabel,
        commonTexts.arbeidsgiverTlf
      )
    );

    return documentComponents;
  };

  const generateBehandlerInnkallingDocument = (
    values: Partial<DialogmoteInnkallingSkjemaValues>
  ) => {
    const documentComponents = [
      ...fellesInfo(values),
      introHilsenBehandler,
      ...behandlerIntro(),
    ];
    if (values.fritekstBehandler) {
      documentComponents.push(createParagraph(values.fritekstBehandler));
    }
    documentComponents.push(...behandlerOutro(), ...hilsen);

    return documentComponents;
  };

  return {
    generateArbeidstakerInnkallingDocument,
    generateArbeidsgiverInnkallingDocument,
    generateBehandlerInnkallingDocument,
  };
};

const fellesInfo = (
  values: Partial<DialogmoteInnkallingSkjemaValues>
): DocumentComponentDto[] => {
  const { dato, klokkeslett, sted, videoLink } = values;
  const components = [
    createParagraph(
      `Sendt ${tilDatoMedManedNavnOgKlokkeslettWithComma(new Date())}`
    ),
    createParagraphWithTitle(
      innkallingTexts.moteTidTitle,
      dato && klokkeslett
        ? tilDatoMedUkedagOgManedNavnOgKlokkeslett(
            genererDato(dato, klokkeslett)
          )
        : ""
    ),
    createParagraphWithTitle(innkallingTexts.moteStedTitle, sted || ""),
  ];
  if (videoLink) {
    components.push(createLink(innkallingTexts.videoLinkTitle, videoLink));
  }
  return components;
};

const arbeidstakerIntro = (
  valgtBehandler?: BehandlerDialogmeldingDTO
): DocumentComponentDto[] => {
  const introParagraph2 = !!valgtBehandler
    ? createParagraph(innkallingTexts.arbeidstaker.intro2WithBehandler)
    : createParagraph(innkallingTexts.arbeidstaker.intro2);

  return [
    createParagraph(innkallingTexts.arbeidstaker.intro1),
    introParagraph2,
  ];
};

const arbeidsgiverIntro = (
  valgtBehandler?: BehandlerDialogmeldingDTO
): DocumentComponentDto[] => {
  const introParagraph2 = !!valgtBehandler
    ? createParagraph(innkallingTexts.arbeidsgiver.intro2withBehandler)
    : createParagraph(innkallingTexts.arbeidsgiver.intro2);

  return [
    createParagraph(innkallingTexts.arbeidsgiver.intro1),
    introParagraph2,
  ];
};

const behandlerIntro = (): DocumentComponentDto[] => {
  return [
    createParagraph(innkallingTexts.behandler.intro1),
    createParagraph(innkallingTexts.behandler.intro2),
  ];
};

const addBehandlerTypeAndName = (
  preText: string,
  valgtBehandler: BehandlerDialogmeldingDTO
) => {
  return `${preText} ${capitalizeWord(valgtBehandler.type)} ${behandlerNavn(
    valgtBehandler
  )}`;
};

const arbeidstakerOutro = (
  valgtBehandler?: BehandlerDialogmeldingDTO
): DocumentComponentDto[] => {
  const outroParagraph1 = !!valgtBehandler
    ? createParagraph(
        addBehandlerTypeAndName(
          innkallingTexts.arbeidstaker.outro1WithBehandler,
          valgtBehandler
        )
      )
    : createParagraph(innkallingTexts.arbeidstaker.outro1);

  return [
    outroParagraph1,
    createParagraphWithTitle(
      innkallingTexts.arbeidstaker.outro2Title,
      innkallingTexts.arbeidstaker.outro2Text
    ),
  ];
};

const arbeidsgiverOutro = (
  valgtBehandler?: BehandlerDialogmeldingDTO
): DocumentComponentDto[] => {
  const outroParagraph2 = !!valgtBehandler
    ? createParagraph(
        addBehandlerTypeAndName(
          innkallingTexts.arbeidsgiver.outro2MedBehandler,
          valgtBehandler
        )
      )
    : createParagraph(innkallingTexts.arbeidsgiver.outro2);

  return [
    createParagraph(innkallingTexts.arbeidsgiver.outro1),
    outroParagraph2,
  ];
};

const behandlerOutro = (): DocumentComponentDto[] => {
  return [
    createParagraph(innkallingTexts.behandler.outro1),
    createParagraph(innkallingTexts.behandler.outro2),
  ];
};
