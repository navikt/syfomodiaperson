import { DocumentComponentDto } from "@/data/documentcomponent/documentComponentTypes";
import React, { ReactElement } from "react";
import { Accordion } from "@navikt/ds-react";
import { DocumentComponentVisning } from "@/components/document/DocumentComponentVisning";

interface Props {
  document: DocumentComponentDto[];
  children: string;
}

export function ForhandsvisDocumentAccordionItem({
  document,
  children,
}: Props): ReactElement {
  return (
    <Accordion.Item>
      <Accordion.Header>{children}</Accordion.Header>
      <Accordion.Content>
        {document.map((component, index) => (
          <DocumentComponentVisning key={index} documentComponent={component} />
        ))}
      </Accordion.Content>
    </Accordion.Item>
  );
}
