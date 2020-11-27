export const sykmeldingHarSoknad = (state, sykmeldingId) => {
  return (
    state.soknader.data.filter((s) => {
      return s.sykmeldingId === sykmeldingId;
    }).length > 0
  );
};
