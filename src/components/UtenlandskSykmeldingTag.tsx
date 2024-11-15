import React from "react";
import { Tag } from "@navikt/ds-react";

const texts = {
  tag: "Utenlandsk",
};

export const UtenlandskSykmeldingTag = () => (
  <Tag className="w-max" variant="neutral">
    {texts.tag}
  </Tag>
);
