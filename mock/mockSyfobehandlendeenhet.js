const mockData = require("./mockData");
const enums = require("./mockDataEnums");

function mockForLokal(server) {
  server.get("/syfobehandlendeenhet/api/internad/:fnr", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(JSON.stringify(mockData[enums.BEHANDLENDEENHET]));
  });
}

function mockSyfobehandlendeenhet(server) {
  mockForLokal(server);
}

module.exports = mockSyfobehandlendeenhet;
