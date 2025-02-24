import { DocumentComponentDto } from "@/data/documentcomponent/documentComponentTypes";
import { useDocumentComponents } from "@/hooks/useDocumentComponents";
import {
  createBulletPoints,
  createHeaderH1,
  createHeaderH3,
  createParagraph,
} from "@/utils/documentComponentUtils";
import {
  Brevmal,
  getForhandsvarselTexts,
} from "@/data/aktivitetskrav/forhandsvarselTexts";
import {
  VarselType,
  VurderingArsak,
} from "@/data/aktivitetskrav/aktivitetskravTypes";
import { tilDatoMedManedNavn } from "@/utils/datoUtils";
import { vurderingArsakTexts } from "@/data/aktivitetskrav/aktivitetskravTexts";

type ForhandsvarselDocumentValues = {
  begrunnelse: string;
  frist: Date;
  mal: Brevmal;
};

type VurderingDocumentValues = {
  varselType: VarselType;
  begrunnelse: string | undefined;
  arsak: VurderingArsak;
};

type InnstillingOmStansDocumentValues = {
  stansDato: Date;
  begrunnelse: string;
};

export const useAktivitetskravVurderingDocument = (): {
  getForhandsvarselDocument(
    values: ForhandsvarselDocumentValues
  ): DocumentComponentDto[];
  getVurderingDocument(values: VurderingDocumentValues): DocumentComponentDto[];
  innstillingOmStansDocument(
    values: InnstillingOmStansDocumentValues
  ): DocumentComponentDto[];
} => {
  const { getHilsen, getIntroGjelder, getVurdertAv } = useDocumentComponents();

  const getForhandsvarselDocument = (values: ForhandsvarselDocumentValues) => {
    const { mal, begrunnelse, frist } = values;
    const sendForhandsvarselTexts = getForhandsvarselTexts({
      mal,
      frist,
    });

    const documentComponents = [
      createHeaderH1(sendForhandsvarselTexts.varselInfo.header),
      createParagraph(sendForhandsvarselTexts.varselInfo.intro),
      createParagraph(sendForhandsvarselTexts.varselInfo.stans1),
      createParagraph(sendForhandsvarselTexts.varselInfo.stans2),
    ];

    if (begrunnelse) {
      documentComponents.push(createParagraph(begrunnelse));
    }

    documentComponents.push(
      createHeaderH3(sendForhandsvarselTexts.unngaStansInfo.header),
      createBulletPoints(
        sendForhandsvarselTexts.unngaStansInfo.tiltak1,
        sendForhandsvarselTexts.unngaStansInfo.tiltak2,
        sendForhandsvarselTexts.unngaStansInfo.tiltak3
      )
    );

    if (mal === Brevmal.UTLAND) {
      documentComponents.push(
        createParagraph(sendForhandsvarselTexts.utland.dokumentasjon)
      );
    }

    documentComponents.push(
      createHeaderH3(sendForhandsvarselTexts.giOssTilbakemelding.header),
      createParagraph(
        sendForhandsvarselTexts.giOssTilbakemelding.tilbakemeldingWithFristDate
      ),
      createHeaderH3(sendForhandsvarselTexts.kontaktOss.header),
      createParagraph(sendForhandsvarselTexts.kontaktOss.kontaktOss),

      createHeaderH3(sendForhandsvarselTexts.lovhjemmel.header),
      createParagraph(sendForhandsvarselTexts.lovhjemmel.aktivitetsplikten),
      createParagraph(sendForhandsvarselTexts.lovhjemmel.pliktInfo),

      getHilsen()
    );

    return documentComponents;
  };

  const getVurderingDocument = (values: VurderingDocumentValues) => {
    const { varselType, begrunnelse, arsak } = values;
    const documentComponents = [
      createHeaderH1("Vurdering av aktivitetskravet"),
      getIntroGjelder(),
      createParagraph(getVurderingText(varselType, arsak)),
    ];

    if (begrunnelse) {
      documentComponents.push(createParagraph(`Begrunnelse: ${begrunnelse}`));
    }
    documentComponents.push(
      createParagraph(getVedtakText(varselType)),
      getVurdertAv()
    );

    return documentComponents;
  };

  function innstillingOmStansDocument({
    stansDato,
    begrunnelse,
  }: InnstillingOmStansDocumentValues): DocumentComponentDto[] {
    const texts = {
      title: "Vurdering av aktivitetskravet - Innstilling om stans",
      stansetSykepenger: (dato: string) =>
        `Nav har stanset sykepengene dine fra og med ${dato}.`,
      pliktTilAktivitet:
        "For å få sykepenger har du plikt til å være i arbeidsrettet aktivitet innen 8 uker.",
      folketrygdloven:
        "Vi har brukt folketrygdloven § 8-8 andre ledd når vi har behandlet saken din.",
    };
    const stansDatoText = tilDatoMedManedNavn(stansDato);
    return [
      createHeaderH1(texts.title),
      getIntroGjelder(),
      createParagraph(texts.stansetSykepenger(stansDatoText)),
      createParagraph(texts.pliktTilAktivitet),
      createParagraph(begrunnelse),
      createParagraph(texts.folketrygdloven),
      getVurdertAv(),
    ];
  }

  return {
    getForhandsvarselDocument,
    getVurderingDocument,
    innstillingOmStansDocument,
  };
};
const getVurderingText = (type: VarselType, arsak: VurderingArsak): string => {
  const arsakText = vurderingArsakTexts[arsak] ?? "";
  const vurdertDato = tilDatoMedManedNavn(new Date());
  switch (type) {
    case VarselType.UNNTAK: {
      return `Det ble vurdert unntak fra aktivitetskravet den ${vurdertDato}. Årsak: ${arsakText}.`;
    }
    case VarselType.OPPFYLT: {
      return `Det ble vurdert at aktivitetskravet er oppfylt den ${vurdertDato}. Årsak: ${arsakText}.`;
    }
    case VarselType.IKKE_AKTUELL: {
      return `Det ble vurdert at aktivitetskravet ikke er aktuelt den ${vurdertDato}. Årsak: ${arsakText}.`;
    }
    case VarselType.FORHANDSVARSEL_STANS_AV_SYKEPENGER: {
      throw new Error("use getForhandsvarselDocument");
    }
    case VarselType.INNSTILLING_OM_STANS: {
      throw new Error("use innstillingOmStansDocument");
    }
  }
};

const getVedtakText = (type: VarselType) => {
  switch (type) {
    case VarselType.UNNTAK:
    case VarselType.OPPFYLT: {
      return "Vedtak ble fattet etter folketrygdloven § 8-8 andre ledd, samt tilhørende rundskriv.";
    }
    case VarselType.IKKE_AKTUELL: {
      return "Det er vurdert at folketrygdloven § 8-8 andre ledd ikke kommer til anvendelse i dette tilfellet.";
    }
    case VarselType.FORHANDSVARSEL_STANS_AV_SYKEPENGER: {
      throw new Error("use getForhandsvarselDocument");
    }
    case VarselType.INNSTILLING_OM_STANS: {
      throw new Error("use innstillingOmStansDocument");
    }
  }
};
