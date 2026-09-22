import { ApiErrorException, defaultErrorTexts, ErrorType } from "@/api/errors";

import { Alert, HStack } from "@navikt/ds-react";

interface Props {
  error: unknown;
  defaultErrorMsgOverride?: string;
}

function resolveErrorMessage(
  error: unknown,
  defaultErrorMsgOverride?: string,
): string {
  if (error instanceof ApiErrorException) {
    const { type, defaultErrorMsg } = error.error;

    if (
      defaultErrorMsgOverride &&
      (type === ErrorType.GENERAL_ERROR || type === ErrorType.CONFLICT_ERROR)
    ) {
      return defaultErrorMsgOverride;
    }

    if (type !== ErrorType.GENERAL_ERROR) {
      return defaultErrorMsg;
    }
  }
  return defaultErrorMsgOverride ?? defaultErrorTexts.generalError;
}

export function SkjemaInnsendingFeil({
  error,
  defaultErrorMsgOverride,
}: Props) {
  const message = resolveErrorMessage(error, defaultErrorMsgOverride);
  return (
    <HStack className={"my-2"}>
      <Alert variant="error" size="small" contentMaxWidth={false}>
        {message}
      </Alert>
    </HStack>
  );
}
