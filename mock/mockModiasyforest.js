const mockData = require("./mockData");
const enums = require("./mockDataEnums");

function mockForLokal(server) {
  server.get("/modiasyforest/api/internad/sykmeldinger", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(JSON.stringify(mockData[enums.SYKMELDINGER]));
  });

  server.get("/modiasyforest/api/internad/allnaermesteledere", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(JSON.stringify(mockData[enums.LEDERE]));
  });

  server.get(
    "/modiasyforest/api/internad/oppfolgingstilfelleperioder",
    (req, res) => {
      const { orgnummer } = req.query;
      res.setHeader("Content-Type", "application/json");
      res.send(
        JSON.stringify(mockData[enums.OPPFOLGINGSTILFELLEPERIODER][orgnummer])
      );
    }
  );

  server.get("/modiasyforest/api/internad/brukerinfo", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(JSON.stringify(mockData[enums.BRUKERINFO]));
  });
}

function mockModiasyforest(server) {
  mockForLokal(server);
}

module.exports = mockModiasyforest;
