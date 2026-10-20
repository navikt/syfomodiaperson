import {
  createHeaderH1,
  createParagraph,
  createParagraphWithTitle,
} from "@/utils/documentComponentUtils";
import { EndreSkjemaValues } from "@/sider/dialogmoter/types/skjemaTypes";
import { tilDatoMedManedNavnOgKlokkeslettWithComma } from "@/utils/datoUtils";
import {
  getCommonTexts,
  getEndreTexts,
} from "@/sider/dialogmoter/hooks/dialogmoteTexts";
import { DialogmoteDTO } from "@/sider/dialogmoter/types/dialogmoteTypes";
import { useDialogmoteDocumentComponents } from "@/hooks/dialogmote/document/useDialogmoteDocumentComponents";
import { DocumentComponentDto } from "@/data/documentcomponent/documentComponentTypes";
import { useMalform } from "@/context/malform/MalformContext";
import { useValgtPersonident } from "@/hooks/useValgtBruker";
import { useNavBrukerData } from "@/data/navbruker/navbruker_hooks";
import { useAktivVeilederinfoQuery } from "@/data/veilederinfo/veilederinfoQueryHooks";

export interface IEndreDocument {
  getEndreDocumentArbeidsgiver(
    values: Partial<EndreSkjemaValues>,
  ): DocumentComponentDto[];

  getEndreDocumentArbeidstaker(
    values: Partial<EndreSkjemaValues>,
  ): DocumentComponentDto[];

  getEndreDocumentBehandler(
    values: Partial<EndreSkjemaValues>,
  ): DocumentComponentDto[];
}

export const useEndreDocument = (dialogmote: DialogmoteDTO): IEndreDocument => {
  const { tid, arbeidsgiver, behandler } = dialogmote;
  const { malform } = useMalform();
  const { data: veilederinfo } = useAktivVeilederinfoQuery();
  const endreEndreTexts = getEndreTexts(malform);
  const commonTexts = getCommonTexts(malform);
  const valgtPersonident = useValgtPersonident();
  const navBruker = useNavBrukerData();
  const { getHilsenMedSendtDato } = useDialogmoteDocumentComponents();
  const hilsenParagraph = getHilsenMedSendtDato(veilederinfo);

  const { getMoteInfo, getIntroHei } = useDialogmoteDocumentComponents();

  const gjelderParagraph = createParagraph(
    `${commonTexts.gjelder} ${navBruker.navn}, f.nr. ${valgtPersonident}.`,
  );

  const introComponents = [
    createParagraph(
      `${endreEndreTexts.intro1} ${tilDatoMedManedNavnOgKlokkeslettWithComma(
        tid,
      )}.`,
    ),
    createParagraph(endreEndreTexts.intro2),
  ];

  const getEndreDocumentArbeidsgiver = (values: Partial<EndreSkjemaValues>) => {
    const documentComponents = [
      createHeaderH1(endreEndreTexts.header),
      gjelderParagraph,
      ...introComponents,
      ...getMoteInfo(values, arbeidsgiver.virksomhetsnummer),
    ];

    if (values.begrunnelseArbeidsgiver) {
      documentComponents.push(createParagraph(values.begrunnelseArbeidsgiver));
    }

    const outro1 = behandler
      ? endreEndreTexts.arbeidsgiver.outro1WithBehandler
      : endreEndreTexts.arbeidsgiver.outro1;
    const outro2 = behandler
      ? `${endreEndreTexts.arbeidsgiver.outro2WithBehandler} ${behandler.behandlerNavn}.`
      : endreEndreTexts.arbeidsgiver.outro2;
    const outro3 = behandler
      ? endreEndreTexts.arbeidsgiver.outro3WithBehandler
      : endreEndreTexts.arbeidsgiver.outro3;

    documentComponents.push(
      createParagraph(outro1),
      createParagraph(endreEndreTexts.arbeidsgiver.outroObligatorisk),
      createParagraph(outro2),
      createParagraphWithTitle(
        endreEndreTexts.arbeidsgiver.outro3Title,
        outro3,
      ),
      hilsenParagraph,
      createParagraph(
        commonTexts.arbeidsgiverTlfLabel,
        commonTexts.arbeidsgiverTlf,
      ),
    );

    return documentComponents;
  };

  const getEndreDocumentArbeidstaker = (values: Partial<EndreSkjemaValues>) => {
    const documentComponents = [
      createHeaderH1(endreEndreTexts.header),
      getIntroHei(),
      ...introComponents,
      ...getMoteInfo(values, arbeidsgiver.virksomhetsnummer),
    ];

    if (values.begrunnelseArbeidstaker) {
      documentComponents.push(createParagraph(values.begrunnelseArbeidstaker));
    }

    const outro1 = behandler
      ? endreEndreTexts.arbeidstaker.outro1WithBehandler
      : endreEndreTexts.arbeidstaker.outro1;
    const outro2 = behandler
      ? `${endreEndreTexts.arbeidstaker.outro2WithBehandler} ${behandler.behandlerNavn}.`
      : endreEndreTexts.arbeidstaker.outro2;
    const outro3 = behandler
      ? endreEndreTexts.arbeidstaker.outro3WithBehandler
      : endreEndreTexts.arbeidstaker.outro3;

    documentComponents.push(
      createParagraph(outro1),
      createParagraph(endreEndreTexts.arbeidstaker.outroObligatorisk),
      createParagraph(outro2),
      createParagraphWithTitle(
        endreEndreTexts.arbeidstaker.outro3Title,
        outro3,
      ),
      hilsenParagraph,
    );

    return documentComponents;
  };

  const getEndreDocumentBehandler = (values: Partial<EndreSkjemaValues>) => {
    const documentComponents = [
      createHeaderH1(endreEndreTexts.behandler.endring),
      createParagraph(endreEndreTexts.behandler.intro),
      gjelderParagraph,
      ...introComponents,
      ...getMoteInfo(values, arbeidsgiver.virksomhetsnummer),
    ];
    if (values.begrunnelseBehandler) {
      documentComponents.push(createParagraph(values.begrunnelseBehandler));
    }

    documentComponents.push(
      createParagraph(endreEndreTexts.behandler.outro),
      hilsenParagraph,
    );

    return documentComponents;
  };

  return {
    getEndreDocumentArbeidstaker,
    getEndreDocumentArbeidsgiver,
    getEndreDocumentBehandler,
  };
};
