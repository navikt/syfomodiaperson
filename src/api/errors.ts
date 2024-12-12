export const defaultErrorTexts = {
  accessDenied: "Du har ikke tilgang til å utføre denne handlingen.",
  generalError: "Det skjedde en uventet feil. Vennligst prøv igjen senere.",
  networkError: "Vi har problemer med nettet, prøv igjen senere.",
  loginRequired: "Handlingen krever at du logger på.",
  conflictError:
    "Det skjedde en uventet feil. Det kan hende en annen veileder har oppdatert siden. Last inn siden på nytt og prøv igjen.",
};

export enum ErrorType {
  ACCESS_DENIED = "ACCESS_DENIED",
  GENERAL_ERROR = "GENERAL_ERROR",
  NETWORK_ERROR = "NETWORK_ERROR",
  LOGIN_REQUIRED = "LOGIN_REQUIRED",
  CONFLICT_ERROR = "CONFLICT_ERROR",
}

export class ApiErrorException extends Error {
  constructor(public readonly error: ApiError, public readonly code?: number) {
    super(error.message);
  }
}

export interface ApiError {
  type: ErrorType;
  message: string;
  defaultErrorMsg: string;
}

export const generalError = (message: string): ApiError => ({
  type: ErrorType.GENERAL_ERROR,
  message,
  defaultErrorMsg: defaultErrorTexts.generalError,
});

export const loginRequiredError = (message: string): ApiError => ({
  type: ErrorType.LOGIN_REQUIRED,
  message,
  defaultErrorMsg: defaultErrorTexts.loginRequired,
});

export const accessDeniedError = (message: string): ApiError => {
  return {
    type: ErrorType.ACCESS_DENIED,
    message,
    defaultErrorMsg: defaultErrorTexts.accessDenied,
  };
};

export const conflictError = (message: string): ApiError => {
  return {
    type: ErrorType.CONFLICT_ERROR,
    message,
    defaultErrorMsg: defaultErrorTexts.conflictError,
  };
};

export const networkError = (message: string): ApiError => ({
  type: ErrorType.NETWORK_ERROR,
  message,
  defaultErrorMsg: defaultErrorTexts.networkError,
});

export const isClientError = (error: unknown): boolean =>
  error instanceof ApiErrorException &&
  error.error.type !== ErrorType.LOGIN_REQUIRED &&
  !!error.code &&
  error.code.toString().startsWith("4");
