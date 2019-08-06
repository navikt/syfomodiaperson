const fnr = window.location.pathname.split('/')[2];

export const config = {
    config: {
        dataSources: {
            veileder: `${window.location.origin}/syfomoteadmin/api/veilederinfo`,
            enheter: `${window.location.origin}/syfomoteadmin/api/enheter`,
        },
        toggles: {
            visEnhetVelger: true,
            visVeileder: true,
            visSokefelt: true,
            toggleSendEventVedEnEnhet: true,
        },
        fnr,
        initiellEnhet: undefined,
        applicationName: 'Sykefraværsoppfølging',
    },
};

export const setContextHolderEventHandlers = (handlePersonSokSubmit, handleChangeEnhet) => {
    config.config.handlePersonsokSubmit = handlePersonSokSubmit;
    config.config.handleChangeEnhet = handleChangeEnhet;
};
