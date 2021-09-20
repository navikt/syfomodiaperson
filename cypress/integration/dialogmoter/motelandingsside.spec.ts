import { MoteState } from "../../support/motelandingsside-commands";
import { selectors } from "../../support/constants";

context("Møtelandingsside actions", () => {
  beforeEach(() => {
    cy.visit("/sykefravaer/moteoversikt");
    cy.OAuth2Login();
  });

  it("Oppretter nytt møte der behandler skal være med", () => {
    cy.stubMoter(MoteState.INGEN_MOTER);

    cy.dataCy(selectors.nyttDM2Mote).click();

    cy.get("button").contains("Ja").click();

    cy.url().should("include", "/sykefravaer/mote");
  });

  it("Ønsker å prøve ny løsning for Dialogmøte", () => {
    cy.stubMoter(MoteState.INGEN_MOTER);

    cy.dataCy(selectors.nyttDM2Mote).click();

    cy.get("button").contains("Nei").click();

    cy.get("button").contains("Ja").click();

    cy.url().should("include", "/sykefravaer/dialogmote");
  });

  it("Ser på referat og avlysningsbrev i møtehistorikk", () => {
    cy.dataCy("Avlysningsbrev").click();

    cy.dataCy(selectors.forhandsvisningModal).contains("Avlysningsbrev");

    cy.dataCy(selectors.forhandsvisningModal).contains("Lukk").click();

    cy.dataCy("Referat").click();

    cy.dataCy(selectors.forhandsvisningModal).contains("Referat");

    cy.contains("Lukk").click();
  });

  it("Har ikke tilgang til DM2, og ser derfor møteplanleggeren", () => {
    cy.stubMoter(MoteState.INGEN_MOTER);
    cy.intercept(
      {
        method: "POST",
        url: "/isenabled/dm2*",
      },
      {
        "syfo.syfomodiaperson.dm2": false,
      }
    );

    cy.dataCy(selectors.nyttMoteplanleggerMote).click();

    cy.url().should("include", "/sykefravaer/mote");
  });
});
