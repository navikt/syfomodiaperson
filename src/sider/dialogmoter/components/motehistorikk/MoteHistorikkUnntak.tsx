import React, { ReactElement } from "react";
import { UnntakDTO } from "@/data/dialogmotekandidat/types/dialogmoteunntakTypes";
import { tilDatoMedManedNavn } from "@/utils/datoUtils";

import {
  DocumentComponentDto,
  DocumentComponentType,
} from "@/data/documentcomponent/documentComponentTypes";
import { unntakArsakTexts } from "@/components/dialogmoteunntak/DialogmoteunntakSkjema";
import { useVeilederInfoQuery } from "@/data/veilederinfo/veilederinfoQueryHooks";
import { ForhandsvisDocumentAccordionItem } from "@/sider/dialogmoter/components/motehistorikk/ForhandsvisDocumentAccordionItem";

const texts = {
  unntakLenke: "Unntak fra dialogmøte",
  arsakLabel: "Årsak til unntak",
  beskrivelseLabel: "Beskrivelse",
  vurdertAvLabel: "Vurdert av",
};

export function unntakLenkeText(unntakCreatedAt: Date) {
  const unntakDatoTekst = tilDatoMedManedNavn(unntakCreatedAt);
  return `${texts.unntakLenke} ${unntakDatoTekst}`;
}

function createUnntakDocument(
  unntak: UnntakDTO,
  veilederNavn: string | undefined
): DocumentComponentDto[] {
  const arsakText: string =
    unntakArsakTexts.find(
      (unntakArsakText) => unntakArsakText.arsak == unntak.arsak
    )?.text || unntak.arsak;
  const componentList: DocumentComponentDto[] = [
    {
      type: DocumentComponentType.PARAGRAPH,
      key: unntak.arsak,
      title: texts.arsakLabel,
      texts: [arsakText],
    },
  ];
  if (unntak.beskrivelse) {
    componentList.push({
      type: DocumentComponentType.PARAGRAPH,
      title: texts.beskrivelseLabel,
      texts: [unntak.beskrivelse],
    });
  }
  if (veilederNavn) {
    componentList.push({
      type: DocumentComponentType.PARAGRAPH,
      title: texts.vurdertAvLabel,
      texts: [`${veilederNavn} (${unntak.createdBy})`],
    });
  }
  return componentList;
}

interface Props {
  unntak: UnntakDTO;
}

export function MoteHistorikkUnntak({ unntak }: Props): ReactElement {
  const { data: veilederinfo } = useVeilederInfoQuery(unntak.createdBy);
  const unntakDocument = createUnntakDocument(
    unntak,
    veilederinfo?.fulltNavn()
  );
  return (
    <ForhandsvisDocumentAccordionItem document={unntakDocument}>
      {unntakLenkeText(unntak.createdAt)}
    </ForhandsvisDocumentAccordionItem>
  );
}
