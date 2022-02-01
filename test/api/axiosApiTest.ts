import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { expect } from "chai";
import { get, post } from "@/api/axios";
import { ApiErrorException, ErrorType } from "@/api/errors";
import { Tilgang } from "@/data/tilgang/tilgangTypes";

describe("Axios API tests", () => {
  let stub: MockAdapter;

  const tilgangDenied: Tilgang = { harTilgang: false, begrunnelse: "SYFO" };
  const tilgangDeniedMessage = { message: "Denied!" };
  const happyCaseMessage = "Woop woop";

  const pathAccessDenied = "/403tilgang";
  const pathAccessDeniedMessage = "/403message";
  const pathNotFound = "/404";
  const pathInternalServerError = "/500";
  const pathHappyCase = "/200";

  before(() => {
    stub = new MockAdapter(axios);
    stub.onGet(pathAccessDenied).replyOnce(403, tilgangDenied);
    stub.onPost(pathAccessDeniedMessage).replyOnce(403, tilgangDeniedMessage);
    stub.onPost(pathNotFound).replyOnce(404);
    stub.onGet(pathInternalServerError).replyOnce(500);
    stub.onGet(pathHappyCase).replyOnce(200, happyCaseMessage);
  });

  describe("Happy case", () => {
    it("returns expected data from http 200", async function () {
      const result = await get(pathHappyCase);
      expect(result).to.equal(happyCaseMessage);
    });
  });

  describe("Access denied tests", () => {
    it("Throws access denied for http 403, and handles Tilgang-object", async function () {
      try {
        await get(pathAccessDenied);
      } catch (e) {
        expect(e instanceof ApiErrorException).to.equal(true);

        const { error, code } = e as ApiErrorException;
        expect(code).to.equal(403);
        expect(error.type).to.equal(ErrorType.ACCESS_DENIED);
        expect(error.message).to.equal(tilgangDenied.begrunnelse);
      }
    });

    it("Throws access denied for http 403, and handles message", async function () {
      try {
        await post(pathAccessDeniedMessage, {
          some: "data",
        });
      } catch (e) {
        expect(e instanceof ApiErrorException).to.equal(true);

        const { error, code } = e as ApiErrorException;
        expect(code).to.equal(403);
        expect(error.type).to.equal(ErrorType.ACCESS_DENIED);
        expect(error.message).to.equal(tilgangDeniedMessage.message);
      }
    });
  });

  describe("General error tests", () => {
    it("Throws general error for http 404", async function () {
      try {
        await post(pathNotFound, { some: "data" });
      } catch (e) {
        expect(e instanceof ApiErrorException).to.equal(true);

        const { error, code } = e as ApiErrorException;
        expect(code).to.equal(404);
        expect(error.type).to.equal(ErrorType.GENERAL_ERROR);
      }
    });

    it("Throws general error for http 500", async function () {
      try {
        await get(pathInternalServerError);
      } catch (e) {
        expect(e instanceof ApiErrorException).to.equal(true);

        const { error, code } = e as ApiErrorException;
        expect(code).to.equal(500);
        expect(error.type).to.equal(ErrorType.GENERAL_ERROR);
      }
    });
  });
});
