import React from "react";
import { IkkeAktuellVurdering } from "../../hooks/useGetDialogmoteIkkeAktuell";
import { tilDatoMedManedNavn } from "@/utils/datoUtils";
import {
  DocumentComponentDto,
  DocumentComponentType,
} from "@/data/documentcomponent/documentComponentTypes";
import { ikkeAktuellArsakTexts } from "@/data/dialogmotekandidat/types/dialogmoteikkeaktuellTypes";
import { useVeilederInfoQuery } from "@/data/veilederinfo/veilederinfoQueryHooks";
import { DocumentComponentVisning } from "@/components/document/DocumentComponentVisning";
import { Accordion } from "@navikt/ds-react";

const texts = {
  ikkeAktuellLenke: "Ikke aktuell for dialogmøte",
  arsakLabel: "Årsak til unntak",
  beskrivelseLabel: "Beskrivelse",
  vurdertAvLabel: "Vurdert av",
};

export function ikkeAktuellLenkeText(createdAt: Date): string {
  const unntakDatoTekst = tilDatoMedManedNavn(createdAt);
  return `${texts.ikkeAktuellLenke} ${unntakDatoTekst}`;
}

function createIkkeAktuellDocument(
  vurdering: IkkeAktuellVurdering,
  veilederNavn: string | undefined
): DocumentComponentDto[] {
  const arsakText: string = ikkeAktuellArsakTexts[vurdering.arsak];
  const componentList: DocumentComponentDto[] = [
    {
      type: DocumentComponentType.PARAGRAPH,
      key: vurdering.arsak,
      title: texts.arsakLabel,
      texts: [arsakText],
    },
  ];
  if (vurdering.beskrivelse) {
    componentList.push({
      type: DocumentComponentType.PARAGRAPH,
      title: texts.beskrivelseLabel,
      texts: [vurdering.beskrivelse],
    });
  }
  if (veilederNavn) {
    componentList.push({
      type: DocumentComponentType.PARAGRAPH,
      title: texts.vurdertAvLabel,
      texts: [`${veilederNavn} (${vurdering.createdBy})`],
    });
  }
  return componentList;
}

interface Props {
  ikkeAktuellVurdering: IkkeAktuellVurdering;
}

export default function MoteHistorikkIkkeAktuell({
  ikkeAktuellVurdering,
}: Props) {
  const { data: veilederinfo } = useVeilederInfoQuery(
    ikkeAktuellVurdering.createdBy
  );

  return (
    <>
      <Accordion.Header>
        {ikkeAktuellLenkeText(ikkeAktuellVurdering.createdAt)}
      </Accordion.Header>
      <Accordion.Content>
        {createIkkeAktuellDocument(
          ikkeAktuellVurdering,
          veilederinfo?.fulltNavn()
        ).map((component, index) => (
          <DocumentComponentVisning key={index} documentComponent={component} />
        ))}
      </Accordion.Content>
    </>
  );
}
