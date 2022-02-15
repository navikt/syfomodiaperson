import { MoteState } from "../../support/motelandingsside-commands";
import { selectors } from "../../support/constants";

const texts = {
  begrunnelseArbeidstaker: "Ørsta rådhus",
  begrunnelseArbeidsgiver: "Pina d grett",
  begrunnelseBehandler: "D greitt, det",
};

context("Avlys dialogmøte", () => {
  beforeEach(() => {
    cy.stubEndepunkter(MoteState.INNKALT_DIALOGMOTE);
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

context("Avlys dialogmøte med behandler", () => {
  beforeEach(() => {
    cy.stubEndepunkter(MoteState.INNKALT_DIALOGMOTE_MED_BEHANDLER);
    cy.visit("/sykefravaer/moteoversikt");
    cy.OAuth2Login();
  });

  it("Tester feilhåndtering for manglende begrunnelse behandler", () => {
    cy.dataCy(selectors.avlysMoteKnapp).click();

    cy.dataCy(selectors.begrunnelseBehandlerTextArea).should(
      "have.attr",
      "aria-invalid",
      "false"
    );

    cy.dataCy(selectors.sendAvlysningKnapp).click();

    cy.dataCy(selectors.begrunnelseBehandlerTextArea).should(
      "have.attr",
      "aria-invalid",
      "true"
    );
  });

  it("Går til avlys dialogmøte, sjekker forhåndsvisning behandler og avbryter", () => {
    cy.dataCy(selectors.avlysMoteKnapp).click();

    cy.dataCy(selectors.begrunnelseBehandlerTextArea).type(
      texts.begrunnelseBehandler
    );
    cy.dataCy(selectors.begrunnelseBehandlerKnapp).click();
    cy.dataCy(selectors.forhandsvisningModal).contains(
      texts.begrunnelseBehandler
    );
    cy.contains("Lukk").click();

    cy.contains("Avbryt").click();
    cy.get(".sidetopp__tittel").contains("Dialogmøter");
  });

  it("Avlyser møte med behandler", () => {
    cy.dataCy(selectors.avlysMoteKnapp).click();

    cy.dataCy(selectors.begrunnelseArbeidstakerTextArea).type(
      texts.begrunnelseArbeidstaker
    );

    cy.dataCy(selectors.begrunnelseArbeidsgiverTextArea).type(
      texts.begrunnelseArbeidsgiver
    );
    cy.dataCy(selectors.begrunnelseBehandlerTextArea).type(
      texts.begrunnelseBehandler
    );

    cy.contains("Send").click();

    cy.url().should("include", "/sykefravaer/moteoversikt");
  });
});
