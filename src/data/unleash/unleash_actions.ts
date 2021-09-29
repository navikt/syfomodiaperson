import { Toggles } from "@/data/unleash/unleash_types";

export enum UnleashActionTypes {
  FETCH_UNLEASH_TOGGLES = "FETCH_UNLEASH_TOGGLES",
  FETCH_UNLEASH_TOGGLES_FAILED = "FETCH_UNLEASH_TOGGLES_FAILED",
  FETCH_UNLEASH_TOGGLES_SUCCESS = "FETCH_UNLEASH_TOGGLES_SUCCESS",
}

export interface FetchUnleashTogglesAction {
  type: UnleashActionTypes.FETCH_UNLEASH_TOGGLES;
  valgtEnhet: string;
  userId: string | undefined;
}

export interface FetchUnleashTogglesFailedAction {
  type: UnleashActionTypes.FETCH_UNLEASH_TOGGLES_FAILED;
}

export interface FetchUnleashTogglesSuccessAction {
  type: UnleashActionTypes.FETCH_UNLEASH_TOGGLES_SUCCESS;
  toggles: Toggles;
}

export const fetchUnleashToggles = (
  valgtEnhet: string,
  userId: string | undefined
): FetchUnleashTogglesAction => ({
  type: UnleashActionTypes.FETCH_UNLEASH_TOGGLES,
  valgtEnhet,
  userId,
});

export const fetchUnleashTogglesFailed = (): FetchUnleashTogglesFailedAction => ({
  type: UnleashActionTypes.FETCH_UNLEASH_TOGGLES_FAILED,
});

export const fetchUnleashTogglesSuccess = (
  toggles: Toggles
): FetchUnleashTogglesSuccessAction => ({
  type: UnleashActionTypes.FETCH_UNLEASH_TOGGLES_SUCCESS,
  toggles,
});

export type UnleashActions =
  | FetchUnleashTogglesAction
  | FetchUnleashTogglesFailedAction
  | FetchUnleashTogglesSuccessAction;
