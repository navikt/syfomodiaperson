import { MoteState } from "../../support/motelandingsside-commands";
import { selectors } from "../../support/constants";
import { tommorrowDateAsString } from "../../support/utils";

const texts = {
  fritekstArbeidstaker: "Fritekst til arbeidstaker",
  fritekstArbeidsgiver: "Fritekst til arbeidsgiver",
  fritekstBehandler: "Fritekst til behandler",
};

context("Innkalling dialogmøte", () => {
  beforeEach(() => {
    cy.stubMoter(MoteState.INGEN_MOTER);
    cy.visit("/sykefravaer/moteoversikt");
    cy.OAuth2Login();
  });

  it("Går til nytt dialogmøte, fyller inn felter (ingen behandler), sjekker forhåndsvisning og sender inn", () => {
    cy.dataCy(selectors.nyttDM2Mote).click();

    cy.get("button").contains("Ja").click();

    cy.url().should("include", "/sykefravaer/dialogmote");

    cy.get("[id=arbeidsgiver]").select("BRANN OG BIL AS");
    cy.get("[id=sted]").type("Videomøte");

    cy.get('[type="radio"]').first().check({ force: true });
    const moteDato = tommorrowDateAsString();
    cy.get("[id=dato]").clear().type(moteDato);
    cy.get("[id=klokkeslett]").clear().type("10:00");

    cy.dataCy(selectors.fritekstArbeidstakerTextArea).type(
      texts.fritekstArbeidstaker
    );
    cy.dataCy(selectors.fritekstArbeidstakerKnapp).click();
    cy.dataCy(selectors.forhandsvisningModal).contains(
      texts.fritekstArbeidstaker
    );
    cy.contains("Lukk").click();

    cy.dataCy(selectors.fritekstArbeidsgiverTextArea).type(
      texts.fritekstArbeidsgiver
    );
    cy.dataCy(selectors.fritekstArbeidsgiverKnapp).click();
    cy.dataCy(selectors.forhandsvisningModal).contains(
      texts.fritekstArbeidsgiver
    );
    cy.dataCy(selectors.fritekstBehandlerKnapp).should("not.exist");
    cy.contains("Lukk").click();

    cy.contains("Send innkallingene").click();

    cy.url().should("include", "/sykefravaer/moteoversikt");
  });

  it("Går til nytt dialogmøte, fyller inn felter og velger behandler, sjekker forhåndsvisning og sender inn", () => {
    cy.dataCy(selectors.nyttDM2Mote).click();

    cy.get("button").contains("Ja").click();

    cy.url().should("include", "/sykefravaer/dialogmote");

    cy.get("[id=arbeidsgiver]").select("BRANN OG BIL AS");
    cy.get("[id=sted]").type("Videomøte");

    cy.get('[type="radio"]').last().check({ force: true });
    const moteDato = tommorrowDateAsString();
    cy.get("[id=dato]").clear().type(moteDato);
    cy.get("[id=klokkeslett]").clear().type("10:00");

    cy.dataCy(selectors.fritekstArbeidstakerTextArea).type(
      texts.fritekstArbeidstaker
    );
    cy.dataCy(selectors.fritekstArbeidstakerKnapp).click();
    cy.dataCy(selectors.forhandsvisningModal).contains(
      texts.fritekstArbeidstaker
    );
    cy.contains("Lukk").click();

    cy.dataCy(selectors.fritekstArbeidsgiverTextArea).type(
      texts.fritekstArbeidsgiver
    );
    cy.dataCy(selectors.fritekstArbeidsgiverKnapp).click();
    cy.dataCy(selectors.forhandsvisningModal).contains(
      texts.fritekstArbeidsgiver
    );

    cy.dataCy(selectors.fritekstBehandlerTextArea).type(
      texts.fritekstBehandler,
      { force: true }
    );
    cy.dataCy(selectors.fritekstBehandlerKnapp).click({ force: true });
    cy.dataCy(selectors.forhandsvisningModal).contains(texts.fritekstBehandler);
    cy.contains("Lukk").click({ force: true });

    cy.contains("Send innkallingene").click({ force: true });

    cy.url().should("include", "/sykefravaer/moteoversikt");
  });
});
