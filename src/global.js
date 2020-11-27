const fnr = window.location.pathname.split("/")[2];

export const config = {
  config: {
    dataSources: {
      veileder: `${process.env.REACT_APP_MOTEADMIN_REST_ROOT}/internad/veilederinfo`,
      enheter: `${process.env.REACT_APP_MOTEADMIN_REST_ROOT}/internad/veilederinfo/enheter`,
    },
    toggles: {
      visEnhetVelger: true,
      visVeileder: true,
      visSokefelt: true,
      toggleSendEventVedEnEnhet: true,
    },
    fnr,
    initiellEnhet: undefined,
    applicationName: "Sykefraværsoppfølging",
  },
};

export const setContextHolderEventHandlers = (
  handlePersonSokSubmit,
  handleChangeEnhet
) => {
  config.config.handlePersonsokSubmit = handlePersonSokSubmit;
  config.config.handleChangeEnhet = handleChangeEnhet;
};
