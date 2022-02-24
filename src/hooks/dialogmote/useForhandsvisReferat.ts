import { ReferatSkjemaValues } from "@/components/dialogmote/referat/Referat";
import {
  DialogmoteDTO,
  DocumentComponentDto,
} from "@/data/dialogmote/types/dialogmoteTypes";
import { useNavBrukerData } from "@/data/navbruker/navbruker_hooks";
import {
  tilDatoMedManedNavnOgKlokkeslettWithComma,
  tilDatoMedUkedagOgManedNavn,
} from "@/utils/datoUtils";
import {
  createHeader,
  createParagraph,
  createParagraphWithTitle,
  createStandardtekstParagraph,
} from "@/utils/documentComponentUtils";
import { Brukerinfo } from "@/data/navbruker/types/Brukerinfo";
import { VeilederinfoDTO } from "@/data/veilederinfo/types/VeilederinfoDTO";
import { referatTexts } from "@/data/dialogmote/dialogmoteTexts";
import { useForhandsvisningHilsen } from "./useForhandsvisningHilsen";
import { useVeilederinfoQuery } from "@/data/veilederinfo/veilederinfoQueryHooks";
import { behandlerDeltakerTekst } from "@/utils/behandlerUtils";
import { useLedereQuery } from "@/data/leder/ledereQueryHooks";

export interface ForhandsvisReferatGenerator {
  generateReferatDocument(
    values: Partial<ReferatSkjemaValues>
  ): DocumentComponentDto[];
}

export const useForhandsvisReferat = (
  dialogmote: DialogmoteDTO
): ForhandsvisReferatGenerator => {
  const navbruker = useNavBrukerData();
  const { data: veilederinfo } = useVeilederinfoQuery();
  const hilsen = useForhandsvisningHilsen();

  const { getCurrentNarmesteLeder } = useLedereQuery();

  const getValgtArbeidsgiver = () =>
    getCurrentNarmesteLeder(dialogmote.arbeidsgiver.virksomhetsnummer)
      ?.virksomhetsnavn;

  const generateReferatDocument = (
    values: Partial<ReferatSkjemaValues>
  ): DocumentComponentDto[] => {
    const documentComponents = [
      createParagraph(
        `Sendt ${tilDatoMedManedNavnOgKlokkeslettWithComma(new Date())}`
      ),
      createHeader(navbruker?.navn),
      ...info(dialogmote, values, navbruker, veilederinfo),
    ];

    const virksomhetsnavn = getValgtArbeidsgiver();

    if (virksomhetsnavn) {
      documentComponents.push(
        createParagraphWithTitle("Arbeidsgiver", virksomhetsnavn)
      );
    }

    documentComponents.push(
      ...intro(),
      ...fritekster(values),
      ...standardTekster(values),
      ...hilsen
    );

    return documentComponents;
  };

  return {
    generateReferatDocument,
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
    `Arbeidsgiver: ${values.naermesteLeder}`,
    `Fra NAV: ${veileder?.navn}`,
  ];
  if (dialogmote.behandler) {
    deltakereTekst.push(
      behandlerDeltakerTekst("Behandler:", dialogmote.behandler)
    );
  }
  const andreDeltakereTekst =
    values.andreDeltakere?.map(
      ({ funksjon, navn }) => `${funksjon}: ${navn}`
    ) || [];

  return [
    createParagraph(`F.nr. ${navbruker.kontaktinfo.fnr}`),
    createParagraph(
      `Dato: ${tilDatoMedUkedagOgManedNavn(dialogmote.tid)}`,
      `Sted: ${dialogmote.sted}`
    ),
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
    createHeader(referatTexts.detteSkjeddeHeader),
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
      createHeader(referatTexts.standardTeksterHeader),
      ...values.standardtekster.map((standardtekst) =>
        createStandardtekstParagraph(standardtekst)
      )
    );
  }
  return documentComponents;
};
