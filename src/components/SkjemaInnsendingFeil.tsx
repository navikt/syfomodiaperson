import { ApiErrorException, defaultErrorTexts, ErrorType } from "@/api/errors";
import React from "react";
import { Alert, HStack } from "@navikt/ds-react";

interface Props {
  error: unknown;
  defaultErrorMsgOverride?: string;
}

function resolveErrorMessage(
  error: unknown,
  defaultErrorMsgOverride: string,
): string {
  if (
    error instanceof ApiErrorException &&
    error.error.type !== ErrorType.GENERAL_ERROR
  ) {
    return error.error.defaultErrorMsg;
  }
  return defaultErrorMsgOverride;
}

export function SkjemaInnsendingFeil({
  error,
  defaultErrorMsgOverride,
}: Props) {
  const message = resolveErrorMessage(
    error,
    defaultErrorMsgOverride ?? defaultErrorTexts.generalError,
  );
  return (
    <HStack className={"my-2"}>
      <Alert variant="error" size="small" contentMaxWidth={false}>
        {message}
      </Alert>
    </HStack>
  );
}
