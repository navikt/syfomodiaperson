import React from "react";
import { Tag } from "@navikt/ds-react";

const texts = {
  tag: "Papir",
};

export const PapirsykmeldingTag = () => (
  <Tag data-color="neutral" className="w-max" variant="outline" size="small">
    {texts.tag}
  </Tag>
);
