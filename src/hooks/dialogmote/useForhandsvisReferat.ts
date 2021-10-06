import { ReferatSkjemaValues } from "@/components/dialogmote/referat/Referat";
import {
  DialogmoteDTO,
  DocumentComponentDto,
} from "@/data/dialogmote/types/dialogmoteTypes";
import { useNavBrukerData } from "@/data/navbruker/navbruker_hooks";
import { tilDatoMedUkedagOgManedNavn } from "@/utils/datoUtils";
import {
  createHeader,
  createParagraph,
  createStandardtekstParagraph,
  createParagraphWithTitle,
} from "@/utils/documentComponentUtils";
import { Brukerinfo } from "@/data/navbruker/types/Brukerinfo";
import { VeilederinfoDTO } from "@/data/veilederinfo/types/VeilederinfoDTO";
import { referatTexts } from "@/data/dialogmote/dialogmoteTexts";
import { useForhandsvisningHilsen } from "./useForhandsvisningHilsen";
import { useVeilederinfoQuery } from "@/data/veilederinfo/veilederinfoQueryHooks";

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

  const generateReferatDocument = (
    values: Partial<ReferatSkjemaValues>
  ): DocumentComponentDto[] => {
    return [
      createHeader(navbruker?.navn),
      ...info(dialogmote, values, navbruker, veilederinfo),
      ...intro(),
      ...fritekster(values),
      ...standardTekster(values),
      ...hilsen,
    ];
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
  const andreDeltakere =
    values.andreDeltakere?.map(
      ({ funksjon, navn }) => `${funksjon}: ${navn}`
    ) || [];
  const deltakere = createParagraphWithTitle(
    referatTexts.deltakereTitle,
    `Arbeidstaker: ${navbruker.navn}`,
    `Arbeidsgiver: ${values.naermesteLeder}`,
    `Fra NAV: ${veileder?.navn}`,
    ...andreDeltakere
  );

  return [
    createParagraph(`F.nr. ${navbruker.kontaktinfo.fnr}`),
    createParagraph(
      `Dato: ${tilDatoMedUkedagOgManedNavn(dialogmote.tid)}`,
      `Sted: ${dialogmote.sted}`
    ),
    deltakere,
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
  if (values.standardtekster) {
    documentComponents.push(
      createHeader(referatTexts.standardTeksterHeader),
      ...values.standardtekster.map((standardtekst) =>
        createStandardtekstParagraph(standardtekst)
      )
    );
  }
  return documentComponents;
};
