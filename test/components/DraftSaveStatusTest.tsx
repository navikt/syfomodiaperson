import { beforeEach, describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { DraftSaveStatus } from "@/components/DraftSaveStatus";

describe("DraftSaveStatus", () => {
  let savedTime: Date;

  beforeEach(() => {
    savedTime = new Date(2026, 10, 2, 9, 30, 45);
  });

  describe("when saving fails", () => {
    it("shows the error as an alert with the default heading", () => {
      render(<DraftSaveStatus isSaveError />);

      const alert = screen.getByRole("alert");

      expect(
        within(alert).getByRole("heading", {
          name: /Lagring av utkast feilet/,
          level: 2,
        }),
      ).to.exist;
    });

    it("hides the saved status even when a saved time exists", () => {
      render(<DraftSaveStatus isSaveError savedTime={savedTime} />);

      expect(screen.getByRole("alert")).to.exist;
      expect(screen.queryByText(/Utkast lagret/)).to.equal(null);
    });
  });

  describe("when saving succeeds", () => {
    it("shows the expiry date and saved time without an error alert", () => {
      render(<DraftSaveStatus isSaveError={false} savedTime={savedTime} />);

      expect(screen.getByText("Utkast lagret, utløper 9. november 09:30:45")).to
        .exist;
      expect(screen.queryByRole("alert")).to.equal(null);
    });

    it("shows no status before a draft has been saved", () => {
      const { container } = render(<DraftSaveStatus isSaveError={false} />);

      expect(container.childElementCount).to.equal(0);
    });
  });
});
