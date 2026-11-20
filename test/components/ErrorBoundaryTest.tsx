import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import ErrorBoundary from "@/components/ErrorBoundary";
import {
  accessDeniedError,
  defaultErrorTexts,
  generalError,
  networkError,
} from "@/api/errors";

function ThrowingChild(): never {
  throw new Error("Testing ErrorBoundary");
}

function getHeading(text: string) {
  return within(screen.getByRole("alert")).getByRole("heading", {
    name: (name) => name.endsWith(text),
    level: 2,
  });
}

describe("ErrorBoundary", () => {
  describe("when a child throws", () => {
    beforeEach(() => {
      vi.spyOn(console, "error").mockImplementation(() => undefined);
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it("shows the general error with a link to report the error", () => {
      render(
        <ErrorBoundary>
          <ThrowingChild />
        </ErrorBoundary>,
      );

      expect(getHeading(defaultErrorTexts.generalError)).to.exist;
      expect(screen.getByText(/Dersom problemet vedvarer/)).to.exist;
      expect(
        screen.getByRole("link", { name: "meld oss gjerne om feilen her" }),
      ).to.exist;
    });
  });

  describe("when there is an api error", () => {
    it("shows a general error with a link to report the error", () => {
      render(<ErrorBoundary apiError={generalError("500")} />);

      expect(getHeading(defaultErrorTexts.generalError)).to.exist;
      expect(
        screen.getByRole("link", { name: "meld oss gjerne om feilen her" }),
      ).to.exist;
    });

    it("shows a network error without a link", () => {
      render(<ErrorBoundary apiError={networkError("Network Error")} />);

      expect(getHeading(defaultErrorTexts.networkError)).to.exist;
      expect(screen.queryByRole("link")).to.equal(null);
    });

    it("shows a custom error message as title and the api error as content", () => {
      const errorMessage = "Klarte ikke hente diskresjonskode for brukeren.";

      render(
        <ErrorBoundary
          apiError={accessDeniedError("403")}
          errorMessage={errorMessage}
        />,
      );

      expect(getHeading(errorMessage)).to.exist;
      expect(screen.getByText(defaultErrorTexts.accessDenied)).to.exist;
      expect(screen.queryByRole("link")).to.equal(null);
    });
  });

  describe("when there is no error", () => {
    it("renders the children", () => {
      render(
        <ErrorBoundary>
          <p>Innhold</p>
        </ErrorBoundary>,
      );

      expect(screen.getByText("Innhold")).to.exist;
      expect(screen.queryByRole("alert")).to.equal(null);
    });
  });
});
