import {
  DocumentComponentDto,
  DocumentComponentType,
} from "@/data/documentcomponent/documentComponentTypes";
import {
  ARBEIDSTAKER_DEFAULT,
  ARBEIDSTAKER_DEFAULT_FULL_NAME,
  VEILEDER_DEFAULT,
} from "../../mock/common/mockConstants";
import { getForhandsvarselManglendeMedvirkningTexts } from "@/data/manglendemedvirkning/manglendeMedvirkningDocumentTexts";
import { tilDatoMedManedNavn } from "@/utils/datoUtils";

export const getSendForhandsvarselDocument = (
  begrunnelse: string,
  frist: Date
): DocumentComponentDto[] => {
  const forhandsvarselTexts = getForhandsvarselManglendeMedvirkningTexts(frist);
  return [
    {
      texts: [forhandsvarselTexts.title],
      type: DocumentComponentType.HEADER_H1,
    },
    {
      texts: [forhandsvarselTexts.intro.p1],
      type: DocumentComponentType.PARAGRAPH,
    },
    {
      texts: [forhandsvarselTexts.intro.p2],
      type: DocumentComponentType.PARAGRAPH,
    },
    {
      texts: [forhandsvarselTexts.intro.p3],
      type: DocumentComponentType.PARAGRAPH,
    },
    {
      texts: [begrunnelse],
      type: DocumentComponentType.PARAGRAPH,
    },
    {
      title: forhandsvarselTexts.tilbakemelding.header,
      texts: [forhandsvarselTexts.tilbakemelding.info],
      type: DocumentComponentType.PARAGRAPH,
    },
    {
      title: forhandsvarselTexts.kontaktinfo.header,
      texts: [forhandsvarselTexts.kontaktinfo.info],
      type: DocumentComponentType.PARAGRAPH,
    },
    {
      title: forhandsvarselTexts.lovhjemmel.header,
      texts: [forhandsvarselTexts.lovhjemmel.intro],
      type: DocumentComponentType.PARAGRAPH,
    },
    {
      texts: [forhandsvarselTexts.lovhjemmel.pliktInfo1],
      type: DocumentComponentType.PARAGRAPH,
    },
    {
      texts: [forhandsvarselTexts.lovhjemmel.pliktInfo2],
      type: DocumentComponentType.PARAGRAPH,
    },
    {
      texts: ["Med vennlig hilsen", VEILEDER_DEFAULT.fulltNavn(), "NAV"],
      type: DocumentComponentType.PARAGRAPH,
    },
  ];
};

export const getOppfyltDocument = (
  begrunnelse: string
): DocumentComponentDto[] => {
  return [
    {
      texts: ["Du har rett til videre utbetaling av sykepenger"],
      type: DocumentComponentType.HEADER_H1,
    },
    {
      texts: [
        `Gjelder ${ARBEIDSTAKER_DEFAULT_FULL_NAME}, f.nr. ${ARBEIDSTAKER_DEFAULT.personIdent}`,
      ],
      type: DocumentComponentType.PARAGRAPH,
    },
    {
      texts: [
        `I forhåndsvarsel av ${tilDatoMedManedNavn(
          new Date()
        )} ble du informert om at NAV vurderte å stanse dine sykepenger. Vi har nå vurdert at plikten til å medvirke er oppfylt, og at du har rett til videre utbetaling av sykepenger.`,
      ],
      type: DocumentComponentType.PARAGRAPH,
    },
    {
      texts: [
        "For å få sykepenger er det et vilkår at du medvirker i egen sak.",
      ],
      type: DocumentComponentType.PARAGRAPH,
    },
    {
      texts: [begrunnelse],
      type: DocumentComponentType.PARAGRAPH,
    },
    {
      texts: [
        `Vi har brukt folketrygdloven § 8-8 første og tredje ledd når vi har behandlet saken din.`,
      ],
      type: DocumentComponentType.PARAGRAPH,
    },
    {
      texts: [`Vurdert av ${VEILEDER_DEFAULT.fulltNavn()}`],
      type: DocumentComponentType.PARAGRAPH,
    },
  ];
};
