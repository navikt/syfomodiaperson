import {
  ReferatMode,
  ReferatSkjemaValues,
} from "@/components/dialogmote/referat/Referat";
import {
  DialogmoteDTO,
  DocumentComponentDto,
} from "@/data/dialogmote/types/dialogmoteTypes";
import { useNavBrukerData } from "@/data/navbruker/navbruker_hooks";
import {
  tilDatoMedManedNavnOgKlokkeslettWithComma,
  tilDatoMedUkedagOgManedNavnOgKlokkeslett,
} from "@/utils/datoUtils";
import {
  createHeaderH1,
  createHeaderH2,
  createParagraph,
  createParagraphWithTitle,
  createStandardtekstParagraph,
} from "@/utils/documentComponentUtils";
import { Brukerinfo } from "@/data/navbruker/types/Brukerinfo";
import { VeilederinfoDTO } from "@/data/veilederinfo/types/VeilederinfoDTO";
import { commonTexts, referatTexts } from "@/data/dialogmote/dialogmoteTexts";
import { useVeilederinfoQuery } from "@/data/veilederinfo/veilederinfoQueryHooks";
import { behandlerDeltokTekst } from "@/utils/behandlerUtils";
import { useDocumentComponents } from "@/hooks/dialogmote/document/useDocumentComponents";

export interface IReferatDocument {
  getReferatDocument(
    values: Partial<ReferatSkjemaValues>
  ): DocumentComponentDto[];
}

export const useReferatDocument = (
  dialogmote: DialogmoteDTO,
  mode: ReferatMode
): IReferatDocument => {
  const navbruker = useNavBrukerData();
  const { data: veilederinfo } = useVeilederinfoQuery();
  const isEndringAvReferat = mode === ReferatMode.ENDRET;
  const { getVirksomhetsnavn, getHilsen } = useDocumentComponents();

  const getReferatDocument = (
    values: Partial<ReferatSkjemaValues>
  ): DocumentComponentDto[] => {
    const documentComponents = [
      createHeaderH1(
        isEndringAvReferat ? referatTexts.endretHeader : referatTexts.nyttHeader
      ),
      createParagraph(
        `Sendt ${tilDatoMedManedNavnOgKlokkeslettWithComma(new Date())}`
      ),
    ];

    if (isEndringAvReferat) {
      documentComponents.push(
        createParagraph(referatTexts.endring),
        createParagraphWithTitle(
          referatTexts.begrunnelseEndringTitle,
          values.begrunnelseEndring || ""
        )
      );
    }

    documentComponents.push(
      createHeaderH2(navbruker?.navn),
      ...info(dialogmote, values, navbruker, veilederinfo)
    );

    const virksomhetsnavn = getVirksomhetsnavn(
      dialogmote.arbeidsgiver.virksomhetsnummer
    );
    if (virksomhetsnavn) {
      documentComponents.push(virksomhetsnavn);
    }

    documentComponents.push(
      ...intro(),
      ...fritekster(values),
      ...standardTekster(values),
      getHilsen()
    );

    return documentComponents;
  };

  return {
    getReferatDocument,
  };
};

const intro = (): DocumentComponentDto[] => {
  return [
    createParagraph(referatTexts.intro1),
    createParagraph(referatTexts.intro2),
  ];
};

const info = (
  dialogmote: DialogmoteDTO,
  values: Partial<ReferatSkjemaValues>,
  navbruker: Brukerinfo,
  veileder?: VeilederinfoDTO
): DocumentComponentDto[] => {
  const deltakereTekst = [
    `Arbeidstaker: ${navbruker.navn}`,
    `Fra NAV: ${veileder?.navn}`,
    `Fra arbeidsgiver: ${values.naermesteLeder}`,
  ];
  if (dialogmote.behandler) {
    deltakereTekst.push(
      behandlerDeltokTekst(dialogmote.behandler, values.behandlerDeltatt)
    );
  }
  const andreDeltakereTekst =
    values.andreDeltakere?.map(
      ({ funksjon, navn }) => `${funksjon}: ${navn}`
    ) || [];

  return [
    createParagraph(`F.nr. ${navbruker.kontaktinfo.fnr}`),
    createParagraphWithTitle(
      commonTexts.moteTidTitle,
      tilDatoMedUkedagOgManedNavnOgKlokkeslett(dialogmote.tid)
    ),
    createParagraphWithTitle(commonTexts.moteStedTitle, dialogmote.sted),
    createParagraphWithTitle(
      referatTexts.deltakereTitle,
      ...deltakereTekst,
      ...andreDeltakereTekst
    ),
  ];
};

const fritekster = (
  values: Partial<ReferatSkjemaValues>
): DocumentComponentDto[] => {
  const documentComponents = [
    createHeaderH2(referatTexts.detteSkjeddeHeader),
    createParagraphWithTitle(
      referatTexts.konklusjonTitle,
      values.konklusjon || ""
    ),
    createParagraphWithTitle(
      referatTexts.arbeidstakersOppgaveTitle,
      values.arbeidstakersOppgave || ""
    ),
    createParagraphWithTitle(
      referatTexts.arbeidsgiversOppgaveTitle,
      values.arbeidsgiversOppgave || ""
    ),
  ];
  if (values.behandlersOppgave) {
    documentComponents.push(
      createParagraphWithTitle(
        referatTexts.behandlersOppgave,
        values.behandlersOppgave
      )
    );
  }
  if (values.veiledersOppgave) {
    documentComponents.push(
      createParagraphWithTitle(
        referatTexts.navOppgaveTitle,
        values.veiledersOppgave
      )
    );
  }
  documentComponents.push(
    createParagraphWithTitle(
      referatTexts.situasjonTitle,
      values.situasjon || ""
    )
  );

  return documentComponents;
};

const standardTekster = (
  values: Partial<ReferatSkjemaValues>
): DocumentComponentDto[] => {
  const documentComponents: DocumentComponentDto[] = [];
  if (values.standardtekster && values.standardtekster.length > 0) {
    documentComponents.push(
      createHeaderH2(referatTexts.standardTeksterHeader),
      ...values.standardtekster.map((standardtekst) =>
        createStandardtekstParagraph(standardtekst)
      )
    );
  }
  return documentComponents;
};
