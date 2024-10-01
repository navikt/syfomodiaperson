import { expect, describe, it } from "vitest";
import { get, post } from "@/api/axios";
import { ApiErrorException, ErrorType } from "@/api/errors";
import { Tilgang } from "@/data/tilgang/tilgangTypes";
import { mockServer } from "../setup";
import { http, HttpResponse } from "msw";

describe("Axios API tests", () => {
  const tilgangDenied: Tilgang = { erGodkjent: false, erAvslatt: true };
  const tilgangDeniedMessage = { message: "Denied!" };
  const happyCaseMessage = "Woop woop";

  const pathAccessDenied = "/403tilgang";
  const pathAccessDeniedMessage = "/403message";
  const pathNotFound = "/404";
  const pathInternalServerError = "/500";
  const pathHappyCase = "/200";

  describe("Happy case", () => {
    it("returns expected data from http 200", async () => {
      mockServer.use(
        http.get(pathHappyCase, () =>
          HttpResponse.text(happyCaseMessage, { status: 200 })
        )
      );

      const result = await get(pathHappyCase);
      expect(result).to.equal(happyCaseMessage);
    });
  });

  describe("Access denied tests", () => {
    it("Throws access denied for http 403, and handles Tilgang-object", async () => {
      mockServer.use(
        http.get(pathAccessDenied, () =>
          HttpResponse.json(tilgangDenied, { status: 403 })
        )
      );

      try {
        await get(pathAccessDenied);
      } catch (e) {
        expect(e instanceof ApiErrorException).to.equal(true);

        const { error, code } = e as ApiErrorException;
        expect(code).to.equal(403);
        expect(error.type).to.equal(ErrorType.ACCESS_DENIED);
      }
    });

    it("Throws access denied for http 403, and handles message", async () => {
      mockServer.use(
        http.post(pathAccessDeniedMessage, () =>
          HttpResponse.json(tilgangDeniedMessage, { status: 403 })
        )
      );

      try {
        await post(pathAccessDeniedMessage, {
          some: "data",
        });
      } catch (e) {
        expect(e instanceof ApiErrorException).to.equal(true);

        const { error, code } = e as ApiErrorException;
        expect(code).to.equal(403);
        expect(error.type).to.equal(ErrorType.ACCESS_DENIED);
      }
    });
  });

  describe("General error tests", () => {
    it("Throws general error for http 404", async () => {
      mockServer.use(
        http.post(pathNotFound, () =>
          HttpResponse.text("Not found", { status: 404 })
        )
      );

      try {
        await post(pathNotFound, { some: "data" });
      } catch (e) {
        expect(e instanceof ApiErrorException).to.equal(true);

        const { error, code } = e as ApiErrorException;
        expect(code).to.equal(404);
        expect(error.type).to.equal(ErrorType.GENERAL_ERROR);
      }
    });

    it("Throws general error for http 500", async () => {
      mockServer.use(
        http.get(pathInternalServerError, () =>
          HttpResponse.text("Internal server error", { status: 500 })
        )
      );

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
