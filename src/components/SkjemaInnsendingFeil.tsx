import { FlexRow, PaddingSize } from "@/components/Layout";
import { ApiErrorException, defaultErrorTexts } from "@/api/errors";
import React from "react";
import { Alert } from "@navikt/ds-react";

interface Props {
  error: unknown;
  bottomPadding?: PaddingSize | null;
}

export function SkjemaInnsendingFeil({
  error,
  bottomPadding = PaddingSize.MD,
}: Props) {
  return (
    <FlexRow bottomPadding={bottomPadding ? bottomPadding : undefined}>
      <Alert variant="error" size="small" contentMaxWidth={false}>
        {error instanceof ApiErrorException
          ? error.error.defaultErrorMsg
          : defaultErrorTexts.generalError}
      </Alert>
    </FlexRow>
  );
}
