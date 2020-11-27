const path = require("path");
const fs = require("fs");
const enums = require("./mockDataEnums");

const mockData = {};

const lastFilTilMinne = (filnavn) => {
  fs.readFile(path.join(__dirname, `/data/${filnavn}.json`), (err, data) => {
    if (err) throw err;
    mockData[filnavn] = JSON.parse(data.toString());
  });
};

lastFilTilMinne(enums.AKTIVBRUKER);
lastFilTilMinne(enums.BEHANDLENDEENHET);
lastFilTilMinne(enums.BRUKERINFO);
lastFilTilMinne(enums.ENHETER);
lastFilTilMinne(enums.FASTLEGER);
lastFilTilMinne(enums.HISTORIKKMOTEBEHOV);
lastFilTilMinne(enums.HISTORIKKMOTER);
lastFilTilMinne(enums.HISTORIKKOPPFOLGINGSPLAN);
lastFilTilMinne(enums.LEDERE);
lastFilTilMinne(enums.MOTEBEHOV);
lastFilTilMinne(enums.MOTER);
lastFilTilMinne(enums.OPPFOLGINGSTILFELLEPERIODER);
lastFilTilMinne(enums.SOKNADER);
lastFilTilMinne(enums.SYKMELDINGER);
lastFilTilMinne(enums.TEKSTER);
lastFilTilMinne(enums.TILGANGTILBRUKER);
lastFilTilMinne(enums.VEILEDERINFO);
lastFilTilMinne(enums.PREDIKSJON);
lastFilTilMinne(enums.VEDTAK);

module.exports = mockData;
