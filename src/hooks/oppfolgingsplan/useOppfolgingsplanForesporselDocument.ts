import { useDocumentComponents } from "@/hooks/useDocumentComponents";
import { DocumentComponentDto } from "@/data/documentcomponent/documentComponentTypes";
import {
  createHeaderH1,
  createParagraph,
} from "@/utils/documentComponentUtils";
import { tilLesbarDatoMedArstall } from "@/utils/datoUtils";

export type ForesporselDocumentValues = {
  narmesteLeder: string;
  virksomhetNavn: string;
};

export function useOppfolgingsplanForesporselDocument() {
  const { getIntroGjelder } = useDocumentComponents();

  function getForesporselDocument(
    values: ForesporselDocumentValues
  ): DocumentComponentDto[] {
    return [
      createHeaderH1(oppfolgingsplanForesporselTexts.title),
      createParagraph(oppfolgingsplanForesporselTexts.dato),
      getIntroGjelder(),
      createParagraph(
        oppfolgingsplanForesporselTexts.mottaker(
          values.narmesteLeder,
          values.virksomhetNavn
        )
      ),
      createParagraph(oppfolgingsplanForesporselTexts.body.hei),
      createParagraph(
        oppfolgingsplanForesporselTexts.body.info1,
        oppfolgingsplanForesporselTexts.body.info2
      ),
      createParagraph(oppfolgingsplanForesporselTexts.body.kontakt),
      createParagraph(oppfolgingsplanForesporselTexts.hilsen),
      createParagraph(oppfolgingsplanForesporselTexts.ikkeSvar),
    ];
  }

  return {
    getForesporselDocument,
  };
}

const oppfolgingsplanForesporselTexts = {
  title: "Nav ber om oppfølgingsplan fra arbeidsgiver",
  dato: `Dato sendt: ${tilLesbarDatoMedArstall(new Date())}`,
  mottaker: (narmesteLeder: string, virksomhetNavn: string) =>
    `Mottaker: ${narmesteLeder}, ${virksomhetNavn}`,
  body: {
    hei: "Hei,",
    info1:
      "Nav ber om at du sender inn oppfølgingsplan for en av dine ansatte som er sykmeldt.",
    info2:
      'Logg inn på "Min side - arbeidsgiver". Klikk på varselet i "bjella" for å se hvem det gjelder.',
    kontakt: "Har du spørsmål, kan du kontakte oss på 55 55 33 36.",
  },
  hilsen: "Vennlig hilsen Nav.",
  ikkeSvar: "Du kan ikke svare på denne meldingen.",
};
