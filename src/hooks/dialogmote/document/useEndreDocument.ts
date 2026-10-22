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
  const dialogmoteEndringTexts = getEndreTexts(malform);
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
      `${dialogmoteEndringTexts.intro1} ${tilDatoMedManedNavnOgKlokkeslettWithComma(
        tid,
      )}.`,
    ),
    createParagraph(dialogmoteEndringTexts.intro2),
  ];

  const getEndreDocumentArbeidsgiver = (values: Partial<EndreSkjemaValues>) => {
    const documentComponents = [
      createHeaderH1(dialogmoteEndringTexts.header),
      gjelderParagraph,
      ...introComponents,
      ...getMoteInfo(values, arbeidsgiver.virksomhetsnummer),
    ];

    if (values.begrunnelseArbeidsgiver) {
      documentComponents.push(createParagraph(values.begrunnelseArbeidsgiver));
    }

    const outro1 = behandler
      ? dialogmoteEndringTexts.arbeidsgiver.outro1WithBehandler
      : dialogmoteEndringTexts.arbeidsgiver.outro1;
    const outro2 = behandler
      ? `${dialogmoteEndringTexts.arbeidsgiver.outro2WithBehandler} ${behandler.behandlerNavn}.`
      : dialogmoteEndringTexts.arbeidsgiver.outro2;
    const outro3 = behandler
      ? dialogmoteEndringTexts.arbeidsgiver.outro3WithBehandler
      : dialogmoteEndringTexts.arbeidsgiver.outro3;

    documentComponents.push(
      createParagraph(outro1),
      createParagraph(dialogmoteEndringTexts.arbeidsgiver.outroObligatorisk),
      createParagraph(outro2),
      createParagraphWithTitle(
        dialogmoteEndringTexts.arbeidsgiver.outro3Title,
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
      createHeaderH1(dialogmoteEndringTexts.header),
      getIntroHei(),
      ...introComponents,
      ...getMoteInfo(values, arbeidsgiver.virksomhetsnummer),
    ];

    if (values.begrunnelseArbeidstaker) {
      documentComponents.push(createParagraph(values.begrunnelseArbeidstaker));
    }

    const outro1 = behandler
      ? dialogmoteEndringTexts.arbeidstaker.outro1WithBehandler
      : dialogmoteEndringTexts.arbeidstaker.outro1;
    const outro2 = behandler
      ? `${dialogmoteEndringTexts.arbeidstaker.outro2WithBehandler} ${behandler.behandlerNavn}.`
      : dialogmoteEndringTexts.arbeidstaker.outro2;
    const outro3 = behandler
      ? dialogmoteEndringTexts.arbeidstaker.outro3WithBehandler
      : dialogmoteEndringTexts.arbeidstaker.outro3;

    documentComponents.push(
      createParagraph(outro1),
      createParagraph(dialogmoteEndringTexts.arbeidstaker.outroObligatorisk),
      createParagraph(outro2),
      createParagraphWithTitle(
        dialogmoteEndringTexts.arbeidstaker.outro3Title,
        outro3,
      ),
      hilsenParagraph,
    );

    return documentComponents;
  };

  const getEndreDocumentBehandler = (values: Partial<EndreSkjemaValues>) => {
    const documentComponents = [
      createHeaderH1(dialogmoteEndringTexts.behandler.endring),
      createParagraph(dialogmoteEndringTexts.behandler.intro),
      gjelderParagraph,
      ...introComponents,
      ...getMoteInfo(values, arbeidsgiver.virksomhetsnummer),
    ];
    if (values.begrunnelseBehandler) {
      documentComponents.push(createParagraph(values.begrunnelseBehandler));
    }

    documentComponents.push(
      createParagraph(dialogmoteEndringTexts.behandler.outro),
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
