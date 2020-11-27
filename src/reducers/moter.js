import * as actions from "../actions/actiontyper";
import { konverterTid } from "../utils/datoUtils";

const defaultState = {
  data: [],
  henter: false,
  hentingFeilet: false,
  hentingForsokt: false,
  sender: false,
  sendingFeilet: false,
  nyeAlternativFeilet: false,
  senderNyeAlternativ: false,
  skalViseFlereAlternativ: false,
  antallNyeTidspunkt: 1,
  tilgang: {},
};

export default function moter(state = defaultState, action) {
  switch (action.type) {
    case actions.OPPRETTER_MOTE: {
      return Object.assign({}, state, {
        henter: false,
        hentingFeilet: false,
        sender: true,
        sendingFeilet: false,
        avbryter: false,
        avbrytFeilet: false,
      });
    }
    case actions.MOTE_OPPRETTET: {
      return Object.assign({}, state, {
        sender: false,
      });
    }
    case actions.OPPRETT_MOTE_FEILET: {
      return Object.assign({}, state, {
        henter: false,
        hentingFeilet: false,
        sender: false,
        sendingFeilet: true,
        avbryter: false,
        avbrytFeilet: false,
      });
    }
    case actions.HENTER_MOTER: {
      return Object.assign({}, state, {
        data: [],
        sender: false,
        henter: true,
        hentingFeilet: false,
        hentingForsokt: false,
        sendingFeilet: false,
        avbryter: false,
        avbrytFeilet: false,
      });
    }
    case actions.MOTER_HENTET: {
      return Object.assign({}, state, {
        data: action.data.map(konverterTid),
        sender: false,
        henter: false,
        hentingFeilet: false,
        hentingForsokt: true,
        sendingFeilet: false,
        avbryter: false,
        avbrytFeilet: false,
      });
    }
    case actions.HENT_MOTER_FEILET: {
      return Object.assign({}, state, {
        data: [],
        sender: false,
        sendingFeilet: false,
        henter: false,
        hentingFeilet: true,
        hentingForsokt: true,
        avbryter: false,
        avbrytFeilet: false,
      });
    }
    case actions.HENT_MOTER_IKKE_TILGANG: {
      return Object.assign({}, state, {
        data: [],
        sender: false,
        sendingFeilet: false,
        henter: false,
        hentingFeilet: false,
        avbryter: false,
        avbrytFeilet: false,
        tilgang: action.tilgang,
      });
    }
    case actions.AVBRYTER_MOTE: {
      return Object.assign({}, state, {
        avbryter: true,
        avbrytFeilet: false,
      });
    }
    case actions.AVBRYT_MOTE_FEILET: {
      return Object.assign({}, state, {
        avbrytFeilet: true,
        avbryter: false,
      });
    }
    case actions.MOTE_AVBRUTT: {
      const data = state.data.map((mote) => {
        if (mote.moteUuid === action.uuid) {
          return Object.assign({}, mote, {
            status: "AVBRUTT",
          });
        }
        return mote;
      });
      return Object.assign(
        {},
        state,
        { data },
        {
          avbryter: false,
          avbrytFeilet: false,
        }
      );
    }
    case actions.BEKREFTER_MOTE: {
      return Object.assign({}, state, {
        bekrefter: true,
        bekreftFeilet: false,
        avbryter: false,
        avbrytFeilet: false,
      });
    }
    case actions.MOTE_BEKREFTET: {
      const data = state.data.map((mote) => {
        if (mote.moteUuid === action.moteUuid) {
          const bekreftetAlternativ = mote.alternativer.filter((alternativ) => {
            return alternativ.id === action.valgtAlternativId;
          })[0];
          return Object.assign({}, mote, {
            status: "BEKREFTET",
            bekreftetTidspunkt: new Date(action.bekreftetTidspunkt),
            bekreftetAlternativ,
          });
        }
        return mote;
      });
      return Object.assign(
        {},
        state,
        { data },
        {
          bekrefter: false,
          bekreftFeilet: false,
          avbryter: false,
          avbrytFeilet: false,
        }
      );
    }
    case actions.BEKREFT_MOTE_FEILET: {
      return Object.assign({}, state, {
        bekrefter: false,
        bekreftFeilet: true,
      });
    }
    case actions.VIS_FLERE_ALTERNATIV: {
      const antallNyeTidspunkt = state.skalViseFlereAlternativ
        ? state.antallNyeTidspunkt + 1
        : 1;
      return Object.assign({}, state, {
        skalViseFlereAlternativ: true,
        antallNyeTidspunkt,
      });
    }
    case actions.FLERE_ALTERNATIV: {
      const antallNyeTidspunkt = state.antallNyeTidspunkt + 1;
      return Object.assign({}, state, {
        antallNyeTidspunkt,
      });
    }
    case actions.FJERN_ALTERNATIV: {
      const antallNyeTidspunkt = state.antallNyeTidspunkt - 1;
      return Object.assign({}, state, {
        antallNyeTidspunkt,
      });
    }
    case actions.AVBRYT_FLERE_ALTERNATIV: {
      return Object.assign({}, state, {
        antallNyeTidspunkt: 0,
        skalViseFlereAlternativ: false,
      });
    }
    case actions.OPPRETTER_FLERE_ALTERNATIV: {
      return Object.assign({}, state, {
        senderNyeAlternativ: true,
        nyeAlternativFeilet: false,
      });
    }
    case actions.OPPRETT_FLERE_ALTERNATIV_FEILET: {
      return Object.assign({}, state, {
        nyeAlternativFeilet: true,
        senderNyeAlternativ: false,
      });
    }
    case actions.OPPRETT_FLERE_ALTERNATIV_BEKREFTET: {
      const sorterEtterId = (alternativer) => {
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
        const nyeAlternativer = action.data.map((alternativ, index) => {
          return Object.assign({}, alternativ, {
            created: new Date(),
            tid: new Date(alternativ.tid),
            id: gamleAlternativer[gamleAlternativer.length - 1].id + index + 1,
          });
        });
        const alternativer = gamleAlternativer.concat(nyeAlternativer);
        const deltakere = mote.deltakere.map((deltaker) => {
          const svar = sorterEtterId(deltaker.svar.concat(nyeAlternativer));
          return Object.assign({}, deltaker, {
            svar,
          });
        });
        return Object.assign({}, mote, {
          alternativer,
          deltakere,
          trengerBehandling: false,
        });
      });

      return Object.assign({}, state, {
        data,
        antallNyeTidspunkt: 0,
        nyeAlternativFeilet: false,
        senderNyeAlternativ: false,
      });
    }
    default: {
      return state;
    }
  }
}
