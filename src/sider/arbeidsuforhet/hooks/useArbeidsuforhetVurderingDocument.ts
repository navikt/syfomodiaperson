import { DocumentComponentDto } from "@/data/documentcomponent/documentComponentTypes";
import { useDocumentComponents } from "@/hooks/useDocumentComponents";
import {
  createHeaderH1,
  createHeaderH3,
  createParagraph,
} from "@/utils/documentComponentUtils";
import {
  arbeidsuforhetTexts,
  getAvslagArbeidsuforhetTexts,
  getForhandsvarselArbeidsuforhetTexts,
} from "@/sider/arbeidsuforhet/data/arbeidsuforhetDocumentTexts";
import {
  arsakTexts,
  VurderingArsak,
  VurderingInitiertAv,
} from "@/sider/arbeidsuforhet/data/arbeidsuforhetTypes";
import { tilLesbarDatoMedArstall } from "@/utils/datoUtils";

type ForhandsvarselDocumentValues = {
  begrunnelse: string;
  frist: Date;
};

type OppfyltDocumentValues = {
  begrunnelse: string;
};

type OppfyltEtterForhandsvarselDocumentValues = {
  begrunnelse: string;
  forhandsvarselSendtDato: Date;
};

type AvslagDocumentValues = {
  begrunnelse: string;
  fom: Date | undefined;
};

type IkkeAktuellDocumentValues = {
  arsak: VurderingArsak;
};

type InnstillingUtenForhandsvarselDocumentValues = {
  vurderingInitiertAv: VurderingInitiertAv;
  begrunnelse: string;
  oppgaveFraNayDato?: Date;
  avslagFom?: Date;
};

export const useArbeidsuforhetVurderingDocument = (): {
  getForhandsvarselDocument(
    values: ForhandsvarselDocumentValues
  ): DocumentComponentDto[];
  getOppfyltDocument(values: OppfyltDocumentValues): DocumentComponentDto[];
  getOppfyltEtterForhandsvarselDocument(
    values: OppfyltEtterForhandsvarselDocumentValues
  ): DocumentComponentDto[];
  getAvslagDocument(
    values: AvslagDocumentValues,
    forhandsvarselDate: Date
  ): DocumentComponentDto[];
  getIkkeAktuellDocument(
    values: IkkeAktuellDocumentValues
  ): DocumentComponentDto[];
  getInnstillingUtenForhandsvarselDocument(
    values: InnstillingUtenForhandsvarselDocumentValues
  ): DocumentComponentDto[];
} => {
  const { getHilsen, getIntroGjelder, getVurdertAv, getVeiledernavn } =
    useDocumentComponents();

  const getForhandsvarselDocument = (values: ForhandsvarselDocumentValues) => {
    const { begrunnelse, frist } = values;
    const sendForhandsvarselTexts = getForhandsvarselArbeidsuforhetTexts({
      frist,
    });

    const documentComponents = [
      createHeaderH1(sendForhandsvarselTexts.varselInfo.header),
      createParagraph(sendForhandsvarselTexts.varselInfo.introWithFristDate),
      createParagraph(sendForhandsvarselTexts.begrunnelse.uteAvStand),
    ];

    if (begrunnelse) {
      documentComponents.push(createParagraph(begrunnelse));
    }

    documentComponents.push(
      createHeaderH3(sendForhandsvarselTexts.duKanUttaleDeg.header),
      createParagraph(
        sendForhandsvarselTexts.duKanUttaleDeg.tilbakemeldingWithFristDate
      ),
      createParagraph(sendForhandsvarselTexts.duKanUttaleDeg.etterFrist),
      createParagraph(sendForhandsvarselTexts.duKanUttaleDeg.friskmeldt),
      createParagraph(sendForhandsvarselTexts.duKanUttaleDeg.kontaktOss),

      createHeaderH3(sendForhandsvarselTexts.lovhjemmel.header),
      createParagraph(sendForhandsvarselTexts.lovhjemmel.arbeidsuforhet),
      createParagraph(sendForhandsvarselTexts.lovhjemmel.pliktInfo),

      getHilsen()
    );

    return documentComponents;
  };

  const getAvslagDocument = (
    values: AvslagDocumentValues,
    forhandsvarselDate: Date
  ) => {
    const { begrunnelse, fom } = values;
    const avslagArbeidsuforhetTexts = getAvslagArbeidsuforhetTexts(
      fom,
      forhandsvarselDate
    );

    const documentComponents = [
      createHeaderH1(avslagArbeidsuforhetTexts.header),
      createParagraph(avslagArbeidsuforhetTexts.forhandsvarselInfo),
      createParagraph(avslagArbeidsuforhetTexts.fom),
      createParagraph(avslagArbeidsuforhetTexts.intro),
    ];

    if (begrunnelse) {
      documentComponents.push(createParagraph(begrunnelse));
    }

    documentComponents.push(
      createParagraph(avslagArbeidsuforhetTexts.hjemmel),
      getVeiledernavn()
    );

    return documentComponents;
  };

  function getOppfyltDocument({ begrunnelse }: OppfyltDocumentValues) {
    return [
      createHeaderH1(arbeidsuforhetTexts.header),
      getIntroGjelder(),
      createParagraph(begrunnelse),
      createParagraph(arbeidsuforhetTexts.viHarBruktLoven),
      getVurdertAv(),
    ];
  }

  function getOppfyltEtterForhandsvarselDocument({
    begrunnelse,
    forhandsvarselSendtDato,
  }: OppfyltEtterForhandsvarselDocumentValues) {
    const documentComponents = [
      createHeaderH1(arbeidsuforhetTexts.tilSykmeldt.header),
      getIntroGjelder(),
      createParagraph(
        arbeidsuforhetTexts.tilSykmeldt.previousForhandsvarsel(
          forhandsvarselSendtDato
        )
      ),
      createParagraph(arbeidsuforhetTexts.tilSykmeldt.forAFaSykepenger),
    ];
    return [
      ...documentComponents,
      createParagraph(begrunnelse),
      createParagraph(arbeidsuforhetTexts.tilSykmeldt.viHarBruktLoven),
      getVurdertAv(),
    ];
  }

  const getIkkeAktuellDocument = ({ arsak }: IkkeAktuellDocumentValues) => {
    return [
      createHeaderH1("Vurdering av § 8-4 arbeidsuførhet"),
      getIntroGjelder(),
      createParagraph(
        `Det er vurdert at folketrygdloven § 8-4 ikke kommer til anvendelse i dette tilfellet. Årsak: ${arsakTexts[arsak]}.`
      ),
      getVurdertAv(),
    ];
  };

  function getInnstillingOmAvslagUtenForhandsvarselDocument({
    vurderingInitiertAv,
    begrunnelse,
    avslagFom,
    oppgaveFraNayDato,
  }: InnstillingUtenForhandsvarselDocumentValues) {
    let vurderingInitiertAvText: string;
    switch (vurderingInitiertAv) {
      case VurderingInitiertAv.NAV_KONTOR:
        vurderingInitiertAvText = "Nav-kontoret.";
        break;
      case VurderingInitiertAv.NAY:
        vurderingInitiertAvText = `Nav arbeid og ytelser. Forespørselen fra Nav arbeid og ytelser om en vurdering ble sendt i Gosys${
          oppgaveFraNayDato
            ? ` ${tilLesbarDatoMedArstall(oppgaveFraNayDato)}.`
            : "."
        }`;
        break;
    }

    return [
      createHeaderH1("Innstilling om avslag til Nav arbeid og ytelser"),
      createParagraph("Vurdering av arbeidsuførhet jf. folketrygdloven § 8-4."),
      getIntroGjelder(),
      createParagraph(
        `Det er ikke sendt forhåndsvarsel i denne saken fordi utbetaling ikke er igangsatt. Vurderingen er initiert av ${vurderingInitiertAvText}`
      ),
      createParagraph(`Nav har vurdert at vilkåret ikke er oppfylt.`),
      createHeaderH3("Begrunnelse for vurderingen"),
      createParagraph(
        `Nav har avslått sykepengene dine fra og med ${tilLesbarDatoMedArstall(
          avslagFom
        )}.`
      ),
      createParagraph(
        "For å få sykepenger må du ha en sykdom eller skade som gjør at du ikke kan være i arbeid, eller at du bare klarer å gjøre deler av arbeidet ditt."
      ),
      createParagraph(begrunnelse),
      createParagraph(
        "Vi har brukt folketrygdloven § 8-4 første ledd når vi har behandlet saken din."
      ),
      getVurdertAv(),
    ];
  }

  return {
    getForhandsvarselDocument,
    getOppfyltDocument,
    getOppfyltEtterForhandsvarselDocument,
    getAvslagDocument,
    getIkkeAktuellDocument,
    getInnstillingUtenForhandsvarselDocument:
      getInnstillingOmAvslagUtenForhandsvarselDocument,
  };
};
