import { MoteState } from "../../support/motelandingsside-commands";
import { selectors } from "../../support/constants";

const texts = {
  begrunnelseArbeidstaker: "Ørsta rådhus",
  begrunnelseArbeidsgiver: "Pina d grett",
};

context("Avlys dialogmøte", () => {
  beforeEach(() => {
    cy.stubMoter(MoteState.INNKALT_DIALOGMOTE);
    cy.visit("/sykefravaer/moteoversikt");
    cy.OAuth2Login();
  });

  it("Tester feilhåndtering for manglende begrunnelse", () => {
    cy.dataCy(selectors.avlysMoteKnapp).click();

    cy.dataCy(selectors.begrunnelseArbeidstakerTextArea).should(
      "have.attr",
      "aria-invalid",
      "false"
    );

    cy.dataCy(selectors.begrunnelseArbeidsgiverTextArea).should(
      "have.attr",
      "aria-invalid",
      "false"
    );

    cy.dataCy(selectors.sendAvlysningKnapp).click();

    cy.dataCy(selectors.begrunnelseArbeidstakerTextArea).should(
      "have.attr",
      "aria-invalid",
      "true"
    );

    cy.dataCy(selectors.begrunnelseArbeidsgiverTextArea).should(
      "have.attr",
      "aria-invalid",
      "true"
    );
  });

  it("Går til avlys dialogmøte, sjekker forhåndsvisning og avbryter", () => {
    cy.dataCy(selectors.avlysMoteKnapp).click();

    cy.dataCy(selectors.begrunnelseArbeidstakerTextArea).type(
      texts.begrunnelseArbeidstaker
    );
    cy.dataCy(selectors.begrunnelseArbeidstakerKnapp).click();
    cy.dataCy(selectors.forhandsvisningModal).contains(
      texts.begrunnelseArbeidstaker
    );
    cy.contains("Lukk").click();

    cy.dataCy(selectors.begrunnelseArbeidsgiverTextArea).type(
      texts.begrunnelseArbeidsgiver
    );
    cy.dataCy(selectors.begrunnelseArbeidsgiverKnapp).click();
    cy.dataCy(selectors.forhandsvisningModal).contains(
      texts.begrunnelseArbeidsgiver
    );
    cy.contains("Lukk").click();

    cy.contains("Avbryt").click();
    cy.get(".sidetopp__tittel").contains("Dialogmøter");
  });

  it("Avlyser møte", () => {
    cy.dataCy(selectors.avlysMoteKnapp).click();

    cy.dataCy(selectors.begrunnelseArbeidstakerTextArea).type(
      texts.begrunnelseArbeidstaker
    );

    cy.dataCy(selectors.begrunnelseArbeidsgiverTextArea).type(
      texts.begrunnelseArbeidsgiver
    );

    cy.contains("Send").click();

    cy.url().should("include", "/sykefravaer/moteoversikt");
  });
});
