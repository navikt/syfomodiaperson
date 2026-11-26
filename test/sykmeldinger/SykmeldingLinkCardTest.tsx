import { beforeEach, describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import SykmeldingLinkCard from "@/sider/sykmeldinger/sykmeldinger/SykmeldingLinkCard";
import { mockOldSykmeldinger } from "../mockdata/sykmeldinger/mockSykmeldinger";
import { renderWithRouter } from "../testRouterUtils";
import { SykmeldingOldFormat } from "@/data/sykmelding/types/SykmeldingOldFormat";
import { VIRKSOMHET_PONTYPANDY } from "@/mocks/common/mockConstants";

const sykmelding = mockOldSykmeldinger[0];

function renderSykmeldingLinkCard(sykmelding: SykmeldingOldFormat) {
  renderWithRouter(
    <SykmeldingLinkCard sykmelding={sykmelding} />,
    "/sykefravaer/sykmeldinger",
    ["/sykefravaer/sykmeldinger"],
  );
}

describe("SykmeldingLinkCard", () => {
  describe("med arbeidsgiver", () => {
    beforeEach(() => {
      renderSykmeldingLinkCard(sykmelding);
    });

    it("har lenke med periode og arbeidsgiver i tilgjengelig navn", () => {
      const link = screen.getByRole("link", {
        name: new RegExp(
          `^Sykmelding\\s?, 22\\. januar – 22\\. mai 2020, ${VIRKSOMHET_PONTYPANDY.virksomhetsnavn}$`,
        ),
      });

      expect(link.getAttribute("href")).to.equal(
        `/sykefravaer/sykmeldinger/${sykmelding.id}`,
      );
    });
  });

  describe("uten arbeidsgiver", () => {
    beforeEach(() => {
      renderSykmeldingLinkCard({
        ...sykmelding,
        innsendtArbeidsgivernavn: undefined,
      });
    });

    it("har lenke med bare periode i tilgjengelig navn", () => {
      expect(
        screen.getByRole("link", {
          name: /^Sykmelding\s?, 22\. januar – 22\. mai 2020$/,
        }),
      ).to.exist;
    });
  });
});
