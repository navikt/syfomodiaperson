import React, { ReactElement, ReactNode } from "react";
import { Accordion } from "@navikt/ds-react";

interface Props {
  header: string;
  children: ReactNode;
}

export default function ForhandsvisDocumentAccordionItem({
  header,
  children,
}: Props): ReactElement {
  return (
    <Accordion.Item>
      <Accordion.Header>{header}</Accordion.Header>
      <Accordion.Content>{children}</Accordion.Content>
    </Accordion.Item>
  );
}
