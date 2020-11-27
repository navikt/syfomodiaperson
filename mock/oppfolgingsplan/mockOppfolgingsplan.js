const defaultOppfolgingsplaner = require("./defaultOppfolgingsplaner");

function getOppfolgingsplaner() {
  const oppfolgingsplaner =
    defaultOppfolgingsplaner.getDefaultOppfolgingsplaner() || [];
  if (oppfolgingsplaner.length === 0) {
    return [];
  }
  return oppfolgingsplaner;
}

module.exports = {
  getOppfolgingsplaner,
};
