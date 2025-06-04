import {
  DocumentComponentDto,
  DocumentComponentType,
} from "@/data/documentcomponent/documentComponentTypes";
import { tilLesbarDatoMedArstall } from "@/utils/datoUtils";
import { ForesporselDocumentValues } from "@/hooks/oppfolgingsplan/useOppfolgingsplanForesporselDocument";
import {
  ARBEIDSTAKER_DEFAULT,
  ARBEIDSTAKER_DEFAULT_FULL_NAME,
} from "@/mocks/common/mockConstants";

export const getExpectedForesporselDocument = ({
  narmesteLeder,
  virksomhetNavn,
}: ForesporselDocumentValues): DocumentComponentDto[] => {
  return [
    {
      texts: ["Nav ber om oppfølgingsplan fra arbeidsgiver"],
      type: DocumentComponentType.HEADER_H1,
    },
    {
      texts: [`Dato sendt: ${tilLesbarDatoMedArstall(new Date())}`],
      type: DocumentComponentType.PARAGRAPH,
    },
    {
      texts: [
        `Gjelder ${ARBEIDSTAKER_DEFAULT_FULL_NAME}, f.nr. ${ARBEIDSTAKER_DEFAULT.personIdent}.`,
      ],
      type: DocumentComponentType.PARAGRAPH,
    },
    {
      texts: [`Mottaker: ${narmesteLeder}, ${virksomhetNavn}`],
      type: DocumentComponentType.PARAGRAPH,
    },
    {
      texts: ["Hei,"],
      type: DocumentComponentType.PARAGRAPH,
    },
    {
      texts: [
        "Nav ber om at du sender inn oppfølgingsplan for en av dine ansatte som er sykmeldt.",
        'Logg inn på "Min side - arbeidsgiver". Klikk på varselet i "bjella" for å se hvem det gjelder.',
      ],
      type: DocumentComponentType.PARAGRAPH,
    },
    {
      texts: ["Har du spørsmål, kan du kontakte oss på 55 55 33 36."],
      type: DocumentComponentType.PARAGRAPH,
    },
    {
      texts: ["Vennlig hilsen Nav."],
      type: DocumentComponentType.PARAGRAPH,
    },
    {
      texts: ["Du kan ikke svare på denne meldingen."],
      type: DocumentComponentType.PARAGRAPH,
    },
  ];
};
