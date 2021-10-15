import { Reducer } from "redux";
import { SykmeldingOldFormat } from "./types/SykmeldingOldFormat";
import {
  newSMFormat2OldFormat,
  oldFormatSMForAG,
} from "@/utils/sykmeldinger/sykmeldingParser";
import { SykmeldingNewFormatDTO } from "./types/SykmeldingNewFormatDTO";
import {
  SykmeldingerActions,
  SykmeldingerActionTypes,
} from "./sykmeldinger_actions";
import { ApiError } from "@/api/errors";

export interface SykmeldingerState {
  henter: boolean;
  error?: ApiError;
  hentet: boolean;
  data: SykmeldingOldFormat[];
  arbeidsgiverssykmeldinger: SykmeldingOldFormat[];
}

const initialState: SykmeldingerState = {
  henter: false,
  error: undefined,
  hentet: false,
  data: [],
  arbeidsgiverssykmeldinger: [],
};

const sykmeldinger: Reducer<SykmeldingerState, SykmeldingerActions> = (
  state = initialState,
  action
) => {
  switch (action.type) {
    case SykmeldingerActionTypes.HENT_SYKMELDINGER_FEILET: {
      return {
        ...state,
        data: [],
        arbeidsgiverssykmeldinger: [],
        henter: false,
        hentet: true,
        error: action.error,
      };
    }
    case SykmeldingerActionTypes.HENT_SYKMELDINGER_HENTER: {
      return {
        ...state,
        data: [],
        arbeidsgiverssykmeldinger: [],
        henter: true,
        hentet: false,
        error: undefined,
      };
    }
    case SykmeldingerActionTypes.SYKMELDINGER_HENTET: {
      return {
        ...state,
        henter: false,
        error: undefined,
        hentet: true,
        data: action.data.map((sykmelding: SykmeldingNewFormatDTO) => {
          return newSMFormat2OldFormat(sykmelding, action.fnr);
        }),
        arbeidsgiverssykmeldinger: action.data.map(
          (sykmelding: SykmeldingNewFormatDTO) => {
            return oldFormatSMForAG(sykmelding, action.fnr);
          }
        ),
      };
    }
    default: {
      return state;
    }
  }
};

export default sykmeldinger;
