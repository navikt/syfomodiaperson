const dateUtil = require("../util/dateUtil");

const getDefaultOppfolgingsplanLPS = () => {
  const today = new Date();
  return {
    uuid: "5f1e2629-062b-442d-ae1f-3b08e9574cd2",
    fnr: "11011011011",
    virksomhetsnummer: "110110110",
    opprettet: dateUtil.leggTilDagerPaDato(today, -1).toJSON(),
    sistEndret: dateUtil.leggTilDagerPaDato(today, -1).toJSON(),
  };
};

function getOppfolgingsplanerLPS() {
  const today = new Date();
  return [
    getDefaultOppfolgingsplanLPS(),
    {
      ...getDefaultOppfolgingsplanLPS(),
      uuid: "5f1e2629-062b-442d-ae1f-3b08e9574cd3",
      opprettet: dateUtil.leggTilDagerPaDato(today, -10).toJSON(),
    },
  ];
}

module.exports = {
  getOppfolgingsplanerLPS,
};
