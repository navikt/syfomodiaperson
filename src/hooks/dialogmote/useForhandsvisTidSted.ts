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
  DocumentComponentDto,
} from "@/data/dialogmote/types/dialogmoteTypes";
import { capitalizeFoersteBokstav } from "@/utils/stringUtils";
import { useForhandsvisningIntro } from "@/hooks/dialogmote/useForhandsvisningIntro";

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
  opprinneligTid: string,
  behandler?: DialogmotedeltakerBehandlerDTO
): ForhandsvisTidStedGenerator => {
  const hilsen = useForhandsvisningHilsen();
  const {
    introHilsenArbeidstaker,
    introHilsenArbeidsgiver,
    introHilsenBehandler,
  } = useForhandsvisningIntro();

  const generateArbeidsgiverTidStedDocument = (
    values: Partial<EndreTidStedSkjemaValues>
  ) => {
    const documentComponents = [
      introHilsenArbeidsgiver,
      ...fellesInfo(values, opprinneligTid),
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
      introHilsenArbeidstaker,
      ...fellesInfo(values, opprinneligTid),
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
      introHilsenBehandler,
      ...fellesInfo(values, opprinneligTid),
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
  opprinneligTid: string
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

  return components;
};

const addBehandlerTypeAndName = (
  preText: string,
  behandler: DialogmotedeltakerBehandlerDTO
) => {
  return `${preText} ${capitalizeFoersteBokstav(
    behandler.behandlerType.toLowerCase()
  )} ${behandler.behandlerNavn}.`;
};
