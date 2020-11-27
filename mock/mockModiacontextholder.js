const mockData = require("./mockData");
const enums = require("./mockDataEnums");

function mockForLokal(server) {
  server.get("/modiacontextholder/api/context/aktivbruker", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(JSON.stringify(mockData[enums.AKTIVBRUKER]));
  });

  server.get("/modiacontextholder/api/context/aktivenhet", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(JSON.stringify(mockData[enums.AKTIVENHET]));
  });

  server.post("/modiacontextholder/api/context", (req, res) => {
    res.send().status(204);
  });
}

function mockModiacontextholder(server) {
  mockForLokal(server);
}

module.exports = mockModiacontextholder;
