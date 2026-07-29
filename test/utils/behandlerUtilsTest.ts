import { describe, expect, it } from "vitest";
import { behandlerDisplayText, behandlerNavn } from "@/utils/behandlerUtils";
import { BehandlerDTO, BehandlerType } from "@/data/behandler/BehandlerDTO";

const behandler: BehandlerDTO = {
  type: BehandlerType.FASTLEGE,
  behandlerRef: "behandler-ref-uuid",
  fornavn: "Dean",
  etternavn: "Pelton",
  kontor: "Greendale Legekontor",
  adresse: "Branngata 2",
  postnummer: "1400",
  poststed: "Pontypandy",
  telefon: "11223344",
};

describe("behandlerUtils", () => {
  describe("behandlerNavn", () => {
    it("kombinerer fornavn og etternavn", () => {
      expect(behandlerNavn(behandler)).to.equal("Dean Pelton");
    });

    it("inkluderer mellomnavn når det finnes", () => {
      const behandlerMedMellomnavn = { ...behandler, mellomnavn: "Las" };

      expect(behandlerNavn(behandlerMedMellomnavn)).to.equal("Dean Las Pelton");
    });
  });

  describe("behandlerDisplayText", () => {
    it("viser type, navn, kontor, adresse, postnummer, poststed og telefon", () => {
      const displayText = behandlerDisplayText(behandler);

      expect(displayText).to.equal(
        "Fastlege: Dean Pelton, Greendale legekontor (Branngata 2, 1400 Pontypandy, tlf 11223344)",
      );
    });
  });
});
