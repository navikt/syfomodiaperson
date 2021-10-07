import { FlexRow, PaddingSize } from "@/components/Layout";
import { AlertStripeFeil } from "nav-frontend-alertstriper";
import { ApiErrorException, defaultErrorTexts } from "@/api/errors";
import React from "react";

interface SkjemaInnsendingFeilProps {
  error: unknown;
}

export const SkjemaInnsendingFeil = ({ error }: SkjemaInnsendingFeilProps) => (
  <FlexRow bottomPadding={PaddingSize.MD}>
    <AlertStripeFeil>
      {error instanceof ApiErrorException
        ? error.error.defaultErrorMsg
        : defaultErrorTexts.generalError}
    </AlertStripeFeil>
  </FlexRow>
);
