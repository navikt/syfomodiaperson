import { FlexRow, PaddingSize } from "@/components/Layout";
import { Heading } from "@navikt/ds-react";
import React from "react";

export const DocumentComponentHeaderH1 = ({ text }: { text: string }) => (
  <FlexRow topPadding={PaddingSize.SM} bottomPadding={PaddingSize.SM}>
    <Heading size="large">{text}</Heading>
  </FlexRow>
);
