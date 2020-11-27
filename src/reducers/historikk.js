const defaultState = {
  moteHistorikk: [],
  motebehovHistorikk: [],
  oppfoelgingsdialogHistorikk: [],
  hentingFeilet: false,
  henterMoter: false,
  hentetMoter: false,
  henterMotebehov: false,
  hentetMotebehov: false,
  henterOppfoelgingsdialoger: false,
  hentetOppfoelgingsdialoger: false,
};

const historikk = (state = defaultState, action = {}) => {
  switch (action.type) {
    case "HISTORIKK_HENTET_MOTER": {
      const nyHistorikk = action.data.map((event) => {
        return Object.assign({}, event, {
          kilde: "MOTER",
        });
      });

      return Object.assign({}, state, {
        henterMoter: false,
        hentetMoter: true,
        moteHistorikk: nyHistorikk,
      });
    }
    case "HISTORIKK_HENTET_MOTEBEHOV": {
      const nyHistorikk = action.data.map((event) => {
        return Object.assign({}, event, {
          kilde: "MOTEBEHOV",
        });
      });
      return Object.assign({}, state, {
        henterMotebehov: false,
        hentetMotebehov: true,
        motebehovHistorikk: nyHistorikk,
      });
    }
    case "HISTORIKK_HENTET_OPPFOELGINGSDIALOG": {
      const nyHistorikk = action.data.map((event) => {
        return Object.assign({}, event, {
          kilde: "OPPFOELGINGSDIALOG",
        });
      });
      return Object.assign({}, state, {
        henterOppfoelgingsdialoger: false,
        hentetOppfoelgingsdialoger: true,
        oppfoelgingsdialogHistorikk: nyHistorikk,
      });
    }
    case "HENTER_HISTORIKK_MOTER": {
      return Object.assign({}, state, {
        henterMoter: true,
      });
    }
    case "HENTER_HISTORIKK_MOTEBEHOV": {
      return Object.assign({}, state, {
        henterMotebehov: true,
      });
    }
    case "HENTER_HISTORIKK_OPPFOELGINGSDIALOG": {
      return Object.assign({}, state, {
        henterOppfoelgingsdialoger: true,
      });
    }
    case "HENT_HISTORIKK_FEILET_MOTER": {
      return Object.assign({}, state, {
        henterMoter: false,
        hentingFeilet: true,
      });
    }
    case "HENT_HISTORIKK_FEILET_MOTEBEHOV": {
      return Object.assign({}, state, {
        henterMotebehov: false,
        hentingFeilet: true,
      });
    }
    case "HENT_HISTORIKK_FEILET_OPPFOELGINGSDIALOG": {
      return Object.assign({}, state, {
        henterOppfoelgingsdialoger: false,
        hentingFeilet: true,
      });
    }
    default: {
      return state;
    }
  }
};

export default historikk;
