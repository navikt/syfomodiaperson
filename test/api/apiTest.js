import { expect } from "chai";
import fetchMock from "fetch-mock";
import { get, post } from "../../src/api";

describe("api", () => {
  describe("get", () => {
    afterEach(() => {
      fetchMock.restore();
    });

    it("Skal kalle på fetch", (done) => {
      fetchMock.get("*", {
        hello: "world",
      });

      get("http://www.nav.no/url").then((data) => {
        expect(data.hello).to.equal("world");
        done();
      });
    });

    it("Skal kalle kaste en 403-exception hvis det returneres 403", (done) => {
      const tilgang = {
        harTilgang: false,
        begrunnelse: "begrunnelse",
      };
      fetchMock.get("*", {
        body: tilgang,
        status: 403,
      });

      get("/ingen-url")
        .then((data) => {
          expect(data.harTilgang).to.equal(tilgang.harTilgang);
          expect(data.begrunnelse).to.equal(tilgang.begrunnelse);
        })
        .catch((e) => {
          expect(e.message).to.equal("403");
          done();
        });
    });

    it("Skal kalle kaste en 404-exception hvis det returneres 404", (done) => {
      fetchMock.get("*", 404);
      get("/ingen-url").catch((e) => {
        expect(e.message).to.equal("404");
        done();
      });
    });

    it("Skal kalle kaste en exception hvis det returneres > 400", (done) => {
      fetchMock.get("*", 500);
      get("/ingen-url").catch((e) => {
        expect(e.message).to.equal("Det oppstod en feil");
        done();
      });
    });
  });

  describe("post", () => {
    afterEach(() => {
      fetchMock.restore();
    });

    it("Skal returnere et promise", (done) => {
      fetchMock.post("*", {
        hello: "world",
      });

      post("/posturl").then(() => {
        done();
      });
    });

    it("Skal kaste en error hvis det oppstår en feil", (done) => {
      fetchMock.post("*", 500);

      post("/posturl").catch((err) => {
        expect(err.message).to.equal("Forespørsel feilet");
        done();
      });
    });
  });
});
