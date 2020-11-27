const mockData = require("./mockData");
const enums = require("./mockDataEnums");

function mockForLokal(server) {
  server.get("/syfosmregister/api/v1/internal/sykmeldinger", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(JSON.stringify(mockData[enums.SYKMELDINGER]));
  });
}

function mockSyfosmregister(server) {
  mockForLokal(server);
}

module.exports = mockSyfosmregister;
