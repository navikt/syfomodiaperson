import { MoteState } from "../../support/motelandingsside-commands";
import { selectors } from "../../support/constants";
import { tommorrowDateAsString } from "../../support/utils";

const texts = {
  begrunnelseArbeidstaker: "Begrunnelse til arbeidstaker",
  begrunnelseArbeidsgiver: "Begrunnelse til arbeidsgiver",
  begrunnelseBehandler: "Begrunnelse til behandler",
};

context("Endre dialogmøte", () => {
  beforeEach(() => {
    cy.stubEndepunkter(MoteState.INNKALT_DIALOGMOTE);
    cy.visit("/sykefravaer/moteoversikt");
    cy.OAuth2Login();
  });

  it("Tester feilhåndtering for manglende begrunnelse", () => {
    cy.dataCy(selectors.endreMoteKnapp).click();

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

    cy.dataCy(selectors.sendEndringKnapp).click();

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

  it("Går til endre dialogmøte, sjekker forhåndsvisning og avbryter", () => {
    cy.dataCy(selectors.endreMoteKnapp).click();

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

  it("Endrer møte", () => {
    cy.dataCy(selectors.endreMoteKnapp).click();

    cy.dataCy(selectors.begrunnelseArbeidstakerTextArea).type(
      texts.begrunnelseArbeidstaker
    );

    cy.dataCy(selectors.begrunnelseArbeidsgiverTextArea).type(
      texts.begrunnelseArbeidsgiver
    );

    cy.get("[id=dato]").clear().type(tommorrowDateAsString());

    cy.contains("Send").click();

    cy.url().should("include", "/sykefravaer/moteoversikt");
  });
});

context("Endre dialogmøte med behandler", () => {
  beforeEach(() => {
    cy.stubEndepunkter(MoteState.INNKALT_DIALOGMOTE_MED_BEHANDLER);
    cy.visit("/sykefravaer/moteoversikt");
    cy.OAuth2Login();
  });

  it("Tester feilhåndtering for manglende begrunnelse behandler", () => {
    cy.dataCy(selectors.endreMoteKnapp).click();
    cy.dataCy(selectors.begrunnelseBehandlerTextArea).should(
      "have.attr",
      "aria-invalid",
      "false"
    );

    cy.dataCy(selectors.sendEndringKnapp).click();
    cy.dataCy(selectors.begrunnelseBehandlerTextArea).should(
      "have.attr",
      "aria-invalid",
      "true"
    );
  });

  it("Går til endre dialogmøte, sjekker forhåndsvisning behandler og avbryter", () => {
    cy.dataCy(selectors.endreMoteKnapp).click();

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

  it("Endrer møte med behandler", () => {
    cy.dataCy(selectors.endreMoteKnapp).click();

    cy.dataCy(selectors.begrunnelseArbeidstakerTextArea).type(
      texts.begrunnelseArbeidstaker
    );
    cy.dataCy(selectors.begrunnelseArbeidsgiverTextArea).type(
      texts.begrunnelseArbeidsgiver
    );
    cy.dataCy(selectors.begrunnelseBehandlerTextArea).type(
      texts.begrunnelseBehandler
    );

    cy.get("[id=dato]").clear().type(tommorrowDateAsString());

    cy.contains("Send").click();

    cy.url().should("include", "/sykefravaer/moteoversikt");
  });
});
