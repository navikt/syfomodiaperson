import {
  createHeaderH1,
  createParagraph,
  createParagraphWithTitle,
} from "@/utils/documentComponentUtils";
import { EndreSkjemaValues } from "@/sider/dialogmoter/types/skjemaTypes";
import { formatDateTimeWithComma } from "@/utils/datoUtils";
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
import { behandlerNavn } from "@/utils/behandlerUtils";
import dayjs from "dayjs";

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
  const { tid, sted, arbeidsgiver, behandler } = dialogmote;
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

  const getIntroComponents = (
    values: Partial<EndreSkjemaValues>,
  ): DocumentComponentDto[] => {
    const hasEndretTidspunkt = Boolean(
      (values.dato && values.dato !== dayjs(tid).format("YYYY-MM-DD")) ||
      (values.klokkeslett && values.klokkeslett !== dayjs(tid).format("HH:mm")),
    );
    const hasEndretSted = Boolean(values.sted && values.sted !== sted);
    const hasLagtTilBehandler = !behandler && Boolean(values.nyBehandler);
    const components = [createParagraph(dialogmoteEndringTexts.intro)];

    if (hasEndretTidspunkt) {
      components.push(
        createParagraph(
          dialogmoteEndringTexts.endretTidspunkt.replace(
            "{tidspunkt}",
            formatDateTimeWithComma(tid),
          ),
        ),
      );
    }
    if (hasEndretSted) {
      components.push(createParagraph(dialogmoteEndringTexts.endretSted));
    }
    if (hasLagtTilBehandler) {
      components.push(createParagraph(dialogmoteEndringTexts.lagtTilBehandler));
    }
    return components;
  };

  function getDeltakerBehandlerNavn(
    values: Partial<EndreSkjemaValues>,
  ): string | undefined {
    if (behandler) {
      return behandler.behandlerNavn;
    }
    return values.nyBehandler && behandlerNavn(values.nyBehandler);
  }

  const getEndreDocumentArbeidsgiver = (values: Partial<EndreSkjemaValues>) => {
    const documentComponents = [
      createHeaderH1(dialogmoteEndringTexts.header),
      gjelderParagraph,
      ...getIntroComponents(values),
      ...getMoteInfo(values, arbeidsgiver.virksomhetsnummer),
    ];

    if (values.begrunnelseArbeidsgiver) {
      documentComponents.push(createParagraph(values.begrunnelseArbeidsgiver));
    }

    const deltakerBehandlerNavn = getDeltakerBehandlerNavn(values);
    const outro1 = deltakerBehandlerNavn
      ? dialogmoteEndringTexts.arbeidsgiver.outro1WithBehandler
      : dialogmoteEndringTexts.arbeidsgiver.outro1;
    const outro2 = deltakerBehandlerNavn
      ? `${dialogmoteEndringTexts.arbeidsgiver.outro2WithBehandler} ${deltakerBehandlerNavn}.`
      : dialogmoteEndringTexts.arbeidsgiver.outro2;
    const outro3 = deltakerBehandlerNavn
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
      ...getIntroComponents(values),
      ...getMoteInfo(values, arbeidsgiver.virksomhetsnummer),
    ];

    if (values.begrunnelseArbeidstaker) {
      documentComponents.push(createParagraph(values.begrunnelseArbeidstaker));
    }

    const deltakerBehandlerNavn = getDeltakerBehandlerNavn(values);
    const outro1 = deltakerBehandlerNavn
      ? dialogmoteEndringTexts.arbeidstaker.outro1WithBehandler
      : dialogmoteEndringTexts.arbeidstaker.outro1;
    const outro2 = deltakerBehandlerNavn
      ? `${dialogmoteEndringTexts.arbeidstaker.outro2WithBehandler} ${deltakerBehandlerNavn}.`
      : dialogmoteEndringTexts.arbeidstaker.outro2;
    const outro3 = deltakerBehandlerNavn
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
      ...getIntroComponents(values),
      ...getMoteInfo(values, arbeidsgiver.virksomhetsnummer),
    ];
    if (values.fritekstBehandler) {
      documentComponents.push(createParagraph(values.fritekstBehandler));
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
