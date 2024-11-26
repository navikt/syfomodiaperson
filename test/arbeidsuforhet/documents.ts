import {
  DocumentComponentDto,
  DocumentComponentType,
} from "@/data/documentcomponent/documentComponentTypes";
import { tilDatoMedManedNavn } from "@/utils/datoUtils";
import {
  ARBEIDSTAKER_DEFAULT,
  ARBEIDSTAKER_DEFAULT_FULL_NAME,
  VEILEDER_DEFAULT,
} from "@/mocks/common/mockConstants";
import { getForhandsvarselArbeidsuforhetTexts } from "@/data/arbeidsuforhet/arbeidsuforhetDocumentTexts";
import { daysFromToday } from "../testUtils";
import {
  arsakTexts,
  VurderingArsak,
} from "@/data/arbeidsuforhet/arbeidsuforhetTypes";
import { getForhandsvarselFrist } from "@/utils/forhandsvarselUtils";

const expectedFristDate = getForhandsvarselFrist();

export const getSendForhandsvarselDocument = (
  begrunnelse: string
): DocumentComponentDto[] => {
  const sendForhandsvarselTexts = getForhandsvarselArbeidsuforhetTexts({
    frist: expectedFristDate,
  });
  return [
    {
      texts: [sendForhandsvarselTexts.varselInfo.header],
      type: DocumentComponentType.HEADER_H1,
    },
    {
      texts: [sendForhandsvarselTexts.varselInfo.introWithFristDate],
      type: DocumentComponentType.PARAGRAPH,
    },
    {
      texts: [sendForhandsvarselTexts.begrunnelse.uteAvStand],
      type: DocumentComponentType.PARAGRAPH,
    },
    {
      texts: [begrunnelse],
      type: DocumentComponentType.PARAGRAPH,
    },
    {
      texts: [sendForhandsvarselTexts.duKanUttaleDeg.header],
      type: DocumentComponentType.HEADER_H3,
    },
    {
      texts: [
        sendForhandsvarselTexts.duKanUttaleDeg.tilbakemeldingWithFristDate,
      ],
      type: DocumentComponentType.PARAGRAPH,
    },
    {
      texts: [sendForhandsvarselTexts.duKanUttaleDeg.etterFrist],
      type: DocumentComponentType.PARAGRAPH,
    },
    {
      texts: [sendForhandsvarselTexts.duKanUttaleDeg.friskmeldt],
      type: DocumentComponentType.PARAGRAPH,
    },
    {
      texts: [sendForhandsvarselTexts.duKanUttaleDeg.kontaktOss],
      type: DocumentComponentType.PARAGRAPH,
    },
    {
      texts: [sendForhandsvarselTexts.lovhjemmel.header],
      type: DocumentComponentType.HEADER_H3,
    },
    {
      texts: [sendForhandsvarselTexts.lovhjemmel.arbeidsuforhet],
      type: DocumentComponentType.PARAGRAPH,
    },
    {
      texts: [sendForhandsvarselTexts.lovhjemmel.pliktInfo],
      type: DocumentComponentType.PARAGRAPH,
    },
    {
      texts: ["Med vennlig hilsen", VEILEDER_DEFAULT.fulltNavn(), "Nav"],
      type: DocumentComponentType.PARAGRAPH,
    },
  ];
};

export const getOppfyltVurderingDocument = (
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
          daysFromToday(-40)
        )} ble du informert om at Nav vurderte å avslå dine sykepenger. Vi har nå vurdert at vilkåret om arbeidsuførhet er oppfylt, og at du har rett til videre utbetaling av sykepenger.`,
      ],
      type: DocumentComponentType.PARAGRAPH,
    },
    {
      texts: [
        `For å få sykepenger må du ha en sykdom eller skade som gjør at du ikke klarer å være i arbeid, eller at du bare klarer å gjøre deler av arbeidet ditt.`,
      ],
      type: DocumentComponentType.PARAGRAPH,
    },
    {
      texts: [begrunnelse],
      type: DocumentComponentType.PARAGRAPH,
    },
    {
      texts: [
        `Vi har brukt folketrygdloven § 8-4 første ledd når vi har behandlet saken din.`,
      ],
      type: DocumentComponentType.PARAGRAPH,
    },
    {
      texts: [`Vurdert av ${VEILEDER_DEFAULT.fulltNavn()}`],
      type: DocumentComponentType.PARAGRAPH,
    },
  ];
};

export const getAvslagVurderingDocument = (
  begrunnelse: string,
  fom: Date | undefined
): DocumentComponentDto[] => {
  return [
    {
      texts: ["Nav har avslått sykepengene dine"],
      type: DocumentComponentType.HEADER_H1,
    },
    {
      texts: [
        `Nav har avslått din søknad om sykepenger fra og med ${
          !!fom ? tilDatoMedManedNavn(fom) : ""
        }.`,
      ],
      type: DocumentComponentType.PARAGRAPH,
    },
    {
      texts: [
        "For å få sykepenger må du ha en sykdom eller skade som gjør at du ikke kan være i arbeid, eller at du bare klarer å gjøre deler av arbeidet ditt.",
      ],
      type: DocumentComponentType.PARAGRAPH,
    },
    {
      texts: [`${begrunnelse}`],
      type: DocumentComponentType.PARAGRAPH,
    },
    {
      texts: [
        "Vi har brukt folketrygdloven § 8-4 første ledd når vi har behandlet saken din.",
      ],
      type: DocumentComponentType.PARAGRAPH,
    },
    {
      texts: [`${VEILEDER_DEFAULT.fulltNavn()}`],
      type: DocumentComponentType.PARAGRAPH,
    },
  ];
};

export const getIkkeAktuellVurderingDocument = (
  arsak: VurderingArsak
): DocumentComponentDto[] => {
  return [
    {
      texts: ["Vurdering av § 8-4 arbeidsuførhet"],
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
        `Det er vurdert at folketrygdloven § 8-4 ikke kommer til anvendelse i dette tilfellet. Årsak: ${arsakTexts[arsak]}.`,
      ],
      type: DocumentComponentType.PARAGRAPH,
    },
    {
      texts: [`Vurdert av ${VEILEDER_DEFAULT.fulltNavn()}`],
      type: DocumentComponentType.PARAGRAPH,
    },
  ];
};
