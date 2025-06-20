import {
  createLink,
  createParagraph,
  createParagraphWithTitle,
} from "@/utils/documentComponentUtils";
import { getCommonTexts } from "@/sider/dialogmoter/hooks/dialogmoteTexts";
import { useLedereQuery } from "@/data/leder/ledereQueryHooks";
import { TidStedSkjemaValues } from "@/sider/dialogmoter/types/skjemaTypes";
import {
  tilDatoMedManedNavnOgKlokkeslettWithComma,
  tilDatoMedUkedagOgManedNavnOgKlokkeslett,
} from "@/utils/datoUtils";
import { genererDato } from "@/sider/dialogmoter/utils";
import { DocumentComponentDto } from "@/data/documentcomponent/documentComponentTypes";
import { useDocumentComponents } from "@/hooks/useDocumentComponents";
import { useMalform } from "@/context/malform/MalformContext";
import { Veileder } from "@/data/veilederinfo/types/Veileder";

export const useDialogmoteDocumentComponents = () => {
  const { getHilsen, getIntroGjelder, getIntroHei } = useDocumentComponents();
  const { getCurrentNarmesteLeder } = useLedereQuery();
  const { malform } = useMalform();
  const commonTexts = getCommonTexts(malform);

  const getVirksomhetsnavn = (
    virksomhetsnummer: string | undefined
  ): DocumentComponentDto | undefined => {
    const arbeidsgiver =
      virksomhetsnummer &&
      getCurrentNarmesteLeder(virksomhetsnummer)?.virksomhetsnavn;

    return arbeidsgiver
      ? createParagraphWithTitle(commonTexts.arbeidsgiverTitle, arbeidsgiver)
      : undefined;
  };

  const getMoteInfo = (
    values: Partial<TidStedSkjemaValues>,
    virksomhetsnummer: string | undefined
  ) => {
    const { dato, klokkeslett, sted, videoLink } = values;
    const tidStedTekst =
      dato && klokkeslett
        ? tilDatoMedUkedagOgManedNavnOgKlokkeslett(
            genererDato(dato, klokkeslett),
            malform
          )
        : "";
    const components: DocumentComponentDto[] = [];
    components.push(
      createParagraphWithTitle(commonTexts.moteTidTitle, tidStedTekst)
    );
    components.push(
      createParagraphWithTitle(commonTexts.moteStedTitle, sted || "")
    );
    if (videoLink) {
      components.push(createLink(commonTexts.videoLinkTitle, videoLink));
      components.push(createParagraph(commonTexts.videoMoteInfo));
    }

    const virksomhetsnavn = getVirksomhetsnavn(virksomhetsnummer);
    if (virksomhetsnavn) {
      components.push(virksomhetsnavn);
    }

    return components;
  };

  const getHilsenMedSendtDato = (veilederinfo: Veileder | undefined) =>
    createParagraph(
      commonTexts.hilsen,
      veilederinfo?.fulltNavn() || "",
      `Nav`,
      "---",
      `${commonTexts.brevSendt} ${tilDatoMedManedNavnOgKlokkeslettWithComma(
        new Date()
      )}`
    );

  return {
    getHilsen,
    getVirksomhetsnavn,
    getMoteInfo,
    getIntroHei,
    getIntroGjelder,
    getHilsenMedSendtDato,
  };
};
