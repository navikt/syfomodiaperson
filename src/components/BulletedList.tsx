import React, { ReactElement } from "react";
import { BodyShort, Heading, List } from "@navikt/ds-react";

interface Props {
  title: string;
  description?: string;
  instructions: string[];
}

export default function BulletedList({
  title,
  description,
  instructions,
}: Props): ReactElement {
  return (
    <>
      <Heading level="3" size="small">
        {title}
      </Heading>
      {description && <BodyShort size="small">{description}</BodyShort>}
      <List as="ul" size="small">
        {instructions.map((text, index) => (
          <List.Item key={index}>{text}</List.Item>
        ))}
      </List>
    </>
  );
}
