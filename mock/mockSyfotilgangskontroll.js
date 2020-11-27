const mockData = require("./mockData");
const enums = require("./mockDataEnums");

function mockForLokal(server) {
  server.get("/syfo-tilgangskontroll/api/tilgang/bruker", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(JSON.stringify(mockData[enums.TILGANGTILBRUKER]));
  });
}

function mockSyfotilgangskoontroll(server) {
  mockForLokal(server);
}

module.exports = mockSyfotilgangskoontroll;
