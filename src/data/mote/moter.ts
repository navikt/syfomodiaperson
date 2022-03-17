import { Reducer } from "redux";
import { MoteAlternativDTO, MoteDTO } from "./types/moteTypes";
import * as actions from "./moter_actions";
import { konverterTid } from "@/utils/datoUtils";
import { Tilgang } from "@/data/tilgang/tilgangTypes";

export interface MoterState {
  henter: boolean;
  hentingFeilet: boolean;
  hentingForsokt: boolean;
  data: MoteDTO[];
  nyeAlternativFeilet: boolean;
  senderNyeAlternativ: boolean;
  skalViseFlereAlternativ: boolean;
  antallNyeTidspunkt: number;
  tilgang?: Tilgang;
}

const initialState: MoterState = {
  henter: false,
  hentingFeilet: false,
  hentingForsokt: false,
  data: [],
  nyeAlternativFeilet: false,
  senderNyeAlternativ: false,
  skalViseFlereAlternativ: false,
  antallNyeTidspunkt: 1,
};

const moter: Reducer<MoterState> = (
  state = initialState,
  action = { type: "" }
) => {
  switch (action.type) {
    case actions.HENTER_MOTER: {
      return {
        ...state,
        data: [],
        sender: false,
        henter: true,
        hentingFeilet: false,
        hentingForsokt: false,
        sendingFeilet: false,
        avbryter: false,
        avbrytFeilet: false,
      };
    }
    case actions.MOTER_HENTET: {
      return {
        ...state,
        data: action.data.map(konverterTid),
        sender: false,
        henter: false,
        hentingFeilet: false,
        hentingForsokt: true,
        sendingFeilet: false,
        avbryter: false,
        avbrytFeilet: false,
      };
    }
    case actions.HENT_MOTER_FEILET: {
      return {
        ...state,
        data: [],
        sender: false,
        sendingFeilet: false,
        henter: false,
        hentingFeilet: true,
        hentingForsokt: true,
        avbryter: false,
        avbrytFeilet: false,
      };
    }
    case actions.HENT_MOTER_IKKE_TILGANG: {
      return {
        ...state,
        data: [],
        sender: false,
        sendingFeilet: false,
        henter: false,
        hentingFeilet: false,
        hentingForsokt: true,
        avbryter: false,
        avbrytFeilet: false,
        tilgang: action.tilgang,
      };
    }
    case actions.AVBRYTER_MOTE: {
      return {
        ...state,
        avbryter: true,
        avbrytFeilet: false,
      };
    }
    case actions.AVBRYT_MOTE_FEILET: {
      return {
        ...state,
        avbrytFeilet: true,
        avbryter: false,
      };
    }
    case actions.MOTE_AVBRUTT: {
      const data = state.data.map((mote) => {
        if (mote.moteUuid === action.uuid) {
          return {
            ...mote,
            status: "AVBRUTT",
          };
        }
        return mote;
      });
      return {
        ...state,
        data,
        avbryter: false,
        avbrytFeilet: false,
      };
    }
    case actions.BEKREFTER_MOTE: {
      return {
        ...state,
        bekrefter: true,
        bekreftFeilet: false,
        avbryter: false,
        avbrytFeilet: false,
      };
    }
    case actions.MOTE_BEKREFTET: {
      const data = state.data.map((mote) => {
        if (mote.moteUuid === action.moteUuid) {
          const bekreftetAlternativ = mote.alternativer.filter((alternativ) => {
            return alternativ.id === action.valgtAlternativId;
          })[0];
          return {
            ...mote,
            status: "BEKREFTET",
            bekreftetTidspunkt: new Date(action.bekreftetTidspunkt),
            bekreftetAlternativ,
          };
        }
        return mote;
      });
      return {
        ...state,
        data,
        bekrefter: false,
        bekreftFeilet: false,
        avbryter: false,
        avbrytFeilet: false,
      };
    }
    case actions.BEKREFT_MOTE_FEILET: {
      return {
        ...state,
        bekrefter: false,
        bekreftFeilet: true,
      };
    }
    case actions.VIS_FLERE_ALTERNATIV: {
      const antallNyeTidspunkt = state.skalViseFlereAlternativ
        ? state.antallNyeTidspunkt + 1
        : 1;
      return {
        ...state,
        skalViseFlereAlternativ: true,
        antallNyeTidspunkt,
      };
    }
    case actions.FLERE_ALTERNATIV: {
      const antallNyeTidspunkt = state.antallNyeTidspunkt + 1;
      return {
        ...state,
        antallNyeTidspunkt,
      };
    }
    case actions.AVBRYT_FLERE_ALTERNATIV: {
      return {
        ...state,
        antallNyeTidspunkt: 0,
        skalViseFlereAlternativ: false,
      };
    }
    case actions.OPPRETTER_FLERE_ALTERNATIV: {
      return {
        ...state,
        senderNyeAlternativ: true,
        nyeAlternativFeilet: false,
      };
    }
    case actions.OPPRETT_FLERE_ALTERNATIV_FEILET: {
      return {
        ...state,
        nyeAlternativFeilet: true,
        senderNyeAlternativ: false,
      };
    }
    case actions.OPPRETT_FLERE_ALTERNATIV_BEKREFTET: {
      const sorterEtterId = (alternativer: MoteAlternativDTO[]) => {
        return [...alternativer].sort((a, b) => {
          if (a.id < b.id) {
            return -1;
          }
          if (a.id > b.id) {
            return 1;
          }
          return 0;
        });
      };
      const data = state.data.map((mote) => {
        if (mote.moteUuid !== action.moteUuid) {
          return mote;
        }
        const gamleAlternativer = sorterEtterId(mote.alternativer);
        const nyeAlternativer = action.data.map(
          (alternativ: MoteAlternativDTO, index: number) => {
            return {
              ...alternativ,
              created: new Date(),
              tid: new Date(alternativ.tid),
              id:
                gamleAlternativer[gamleAlternativer.length - 1].id + index + 1,
            };
          }
        );
        const alternativer = gamleAlternativer.concat(nyeAlternativer);
        const deltakere = mote.deltakere.map((deltaker) => {
          const svar = sorterEtterId(deltaker.svar.concat(nyeAlternativer));
          return {
            ...deltaker,
            svar,
          };
        });
        return {
          ...mote,
          alternativer,
          deltakere,
          trengerBehandling: false,
        };
      });

      return {
        ...state,
        data,
        antallNyeTidspunkt: 0,
        nyeAlternativFeilet: false,
        senderNyeAlternativ: false,
      };
    }
    default: {
      return state;
    }
  }
};

export default moter;
