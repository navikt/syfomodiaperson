const mockData = require("./mockData");
const enums = require("./mockDataEnums");

function mockForLokal(server) {
  server.get("/syfosoknad/api/veileder/internad/soknader", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(JSON.stringify(mockData[enums.SOKNADER]));
  });
}

function mockSyfosoknad(server) {
  mockForLokal(server);
}

module.exports = mockSyfosoknad;
