import { expect, describe, it } from "vitest";
import { get, post } from "@/api/axios";
import { isClientError } from "@/api/errors";
import { mockServer } from "../setup";
import { http, HttpResponse } from "msw";

describe("errors test", () => {
  const pathBadRequest = "/400";
  const pathAccessDenied = "/403";
  const pathNotFound = "/404";
  const pathInternalServerError = "/500";

  describe("isClientError", () => {
    it("returns true from http 400", async () => {
      mockServer.use(
        http.post(pathBadRequest, () => new HttpResponse(null, { status: 400 }))
      );

      try {
        await post(pathBadRequest, {});
      } catch (e) {
        expect(isClientError(e)).to.equal(true);
      }
    });
    it("returns true from http 403", async () => {
      mockServer.use(
        http.get(pathAccessDenied, () =>
          HttpResponse.json({ message: "Denied!" }, { status: 403 })
        )
      );

      try {
        await get(pathAccessDenied);
      } catch (e) {
        expect(isClientError(e)).to.equal(true);
      }
    });
    it("returns true from http 404", async () => {
      mockServer.use(
        http.get(pathNotFound, () =>
          HttpResponse.text("Not found", { status: 404 })
        )
      );

      try {
        await get(pathNotFound);
      } catch (e) {
        expect(isClientError(e)).to.equal(true);
      }
    });
    it("returns false from http 500", async () => {
      mockServer.use(
        http.post(pathInternalServerError, () =>
          HttpResponse.text("Internal server error", { status: 500 })
        )
      );

      try {
        await post(pathInternalServerError, {});
      } catch (e) {
        expect(isClientError(e)).to.equal(false);
      }
    });
  });
});
