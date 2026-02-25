import React from "react";
import { Tag } from "@navikt/ds-react";

const texts = {
  tag: "Utenlandsk",
};

export const UtenlandskSykmeldingTag = () => (
  <Tag data-color="neutral" className="w-max" variant="outline" size="small">
    {texts.tag}
  </Tag>
);
