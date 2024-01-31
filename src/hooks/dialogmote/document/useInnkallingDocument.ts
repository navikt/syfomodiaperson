import { DialogmoteInnkallingSkjemaValues } from "@/components/dialogmote/innkalling/DialogmoteInnkallingSkjema";
import { tilDatoMedManedNavnOgKlokkeslettWithComma } from "@/utils/datoUtils";
import {
  commonTexts,
  innkallingTexts,
} from "@/data/dialogmote/dialogmoteTexts";
import {
  createHeaderH1,
  createParagraph,
  createParagraphWithTitle,
} from "@/utils/documentComponentUtils";
import { BehandlerDTO } from "@/data/behandler/BehandlerDTO";
import { capitalizeWord } from "@/utils/stringUtils";
import { behandlerNavn } from "@/utils/behandlerUtils";
import { useDialogmoteDocumentComponents } from "@/hooks/dialogmote/document/useDialogmoteDocumentComponents";
import { DocumentComponentDto } from "@/data/documentcomponent/documentComponentTypes";
import { Malform, useMalform } from "@/context/malform/MalformContext";
import { useAktivVeilederinfoQuery } from "@/data/veilederinfo/veilederinfoQueryHooks";

export interface IInnkallingDocument {
  getInnkallingDocumentArbeidstaker(
    values: Partial<DialogmoteInnkallingSkjemaValues>,
    valgtBehandler: BehandlerDTO | undefined
  ): DocumentComponentDto[];

  getInnkallingDocumentArbeidsgiver(
    values: Partial<DialogmoteInnkallingSkjemaValues>,
    valgtBehandler: BehandlerDTO | undefined
  ): DocumentComponentDto[];

  getInnkallingDocumentBehandler(
    values: Partial<DialogmoteInnkallingSkjemaValues>
  ): DocumentComponentDto[];
}

export const useInnkallingDocument = (): IInnkallingDocument => {
  const introComponents = [
    createHeaderH1("Innkalling til dialogmøte"),
    createParagraph(
      `Sendt ${tilDatoMedManedNavnOgKlokkeslettWithComma(new Date())}`
    ),
  ];
  const { getMoteInfo, getIntroHei, getIntroGjelder } =
    useDialogmoteDocumentComponents();
  const { malform } = useMalform();
  const { data: veilederinfo } = useAktivVeilederinfoQuery();
  const hilsenParagraph = createParagraph(
    innkallingTexts.hilsen[malform],
    veilederinfo?.navn || "",
    `NAV`
  );

  const getInnkallingDocumentArbeidstaker = (
    values: Partial<DialogmoteInnkallingSkjemaValues>,
    valgtBehandler: BehandlerDTO | undefined
  ) => {
    const documentComponents = [
      ...introComponents,
      ...getMoteInfo(values, values.arbeidsgiver, malform),
      getIntroHei(),
      ...arbeidstakerIntro(valgtBehandler, malform),
    ];
    if (values.fritekstArbeidstaker) {
      documentComponents.push(createParagraph(values.fritekstArbeidstaker));
    }
    documentComponents.push(
      ...arbeidstakerOutro(valgtBehandler, malform),
      hilsenParagraph
    );

    return documentComponents;
  };

  const getInnkallingDocumentArbeidsgiver = (
    values: Partial<DialogmoteInnkallingSkjemaValues>,
    valgtBehandler: BehandlerDTO | undefined
  ) => {
    const documentComponents = [
      ...introComponents,
      ...getMoteInfo(values, values.arbeidsgiver, malform),
      getIntroGjelder(),
      createParagraph(innkallingTexts.arbeidsgiver.intro1),
    ];
    if (values.fritekstArbeidsgiver) {
      documentComponents.push(createParagraph(values.fritekstArbeidsgiver));
    }
    documentComponents.push(
      ...arbeidsgiverOutro(valgtBehandler),
      hilsenParagraph,
      createParagraph(
        commonTexts.arbeidsgiverTlfLabel,
        commonTexts.arbeidsgiverTlf
      )
    );

    return documentComponents;
  };

  const getInnkallingDocumentBehandler = (
    values: Partial<DialogmoteInnkallingSkjemaValues>
  ) => {
    const documentComponents = [
      createHeaderH1("Innkalling til dialogmøte, svar ønskes"),
      createParagraph(
        `Sendt ${tilDatoMedManedNavnOgKlokkeslettWithComma(new Date())}`
      ),
      createParagraph(innkallingTexts.behandler.intro),
      ...getMoteInfo(values, values.arbeidsgiver, malform),
      getIntroGjelder(),
    ];

    if (values.fritekstBehandler) {
      documentComponents.push(createParagraph(values.fritekstBehandler));
    }
    documentComponents.push(
      createParagraph(innkallingTexts.behandler.outro),
      hilsenParagraph
    );

    return documentComponents;
  };

  return {
    getInnkallingDocumentArbeidstaker,
    getInnkallingDocumentArbeidsgiver,
    getInnkallingDocumentBehandler,
  };
};

const arbeidstakerIntro = (
  valgtBehandler: BehandlerDTO | undefined,
  malform: Malform
): DocumentComponentDto[] => {
  const introParagraph2 = !!valgtBehandler
    ? createParagraph(innkallingTexts.arbeidstaker.intro2WithBehandler[malform])
    : createParagraph(innkallingTexts.arbeidstaker.intro2[malform]);

  return [
    createParagraph(innkallingTexts.arbeidstaker.intro1[malform]),
    introParagraph2,
  ];
};

const addBehandlerTypeAndName = (
  preText: string,
  valgtBehandler: BehandlerDTO
) => {
  return `${preText} ${capitalizeWord(
    valgtBehandler.type ?? ""
  )} ${behandlerNavn(valgtBehandler)}.`;
};

const arbeidstakerOutro = (
  valgtBehandler: BehandlerDTO | undefined,
  malform: Malform
): DocumentComponentDto[] => {
  const outro1 = valgtBehandler
    ? addBehandlerTypeAndName(
        innkallingTexts.arbeidstaker.outro1WithBehandler[malform],
        valgtBehandler
      )
    : innkallingTexts.arbeidstaker.outro1[malform];
  const outro2 = valgtBehandler
    ? innkallingTexts.arbeidstaker.outro2WithBehandler[malform]
    : innkallingTexts.arbeidstaker.outro2[malform];

  return [
    createParagraph(innkallingTexts.arbeidstaker.outroObligatorisk[malform]),
    createParagraph(outro1),
    createParagraphWithTitle(
      innkallingTexts.arbeidstaker.outro2Title[malform],
      outro2
    ),
  ];
};

const arbeidsgiverOutro = (
  valgtBehandler: BehandlerDTO | undefined
): DocumentComponentDto[] => {
  const outro1 = valgtBehandler
    ? addBehandlerTypeAndName(
        innkallingTexts.arbeidsgiver.outro1WithBehandler,
        valgtBehandler
      )
    : innkallingTexts.arbeidsgiver.outro1;
  const outro2 = valgtBehandler
    ? innkallingTexts.arbeidsgiver.outro2WithBehandler
    : innkallingTexts.arbeidsgiver.outro2;

  return [
    createParagraph(innkallingTexts.arbeidsgiver.outroObligatorisk),
    createParagraph(outro1),
    createParagraphWithTitle(innkallingTexts.arbeidsgiver.outro2Title, outro2),
  ];
};
