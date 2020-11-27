const mockData = require("./mockData");
const enums = require("./mockDataEnums");

function mockForLokal(server) {
  server.get("/veileder/vedtak", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(JSON.stringify(mockData[enums.VEDTAK]));
  });
}

function mockVedtak(server) {
  mockForLokal(server);
}

module.exports = mockVedtak;
