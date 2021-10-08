import { MoteState } from "../../support/motelandingsside-commands";
import { selectors } from "../../support/constants";

const texts = {
  begrunnelseArbeidstaker: "Begrunnelse til arbeidstaker",
  begrunnelseArbeidsgiver: "Begrunnelse til arbeidsgiver",
};

const MILLISECONDS_PER_HOUR = 3600000;
const DAY_IN_MILLISECONDS = MILLISECONDS_PER_HOUR * 24;

const TOMORROW = new Date(Date.now() + DAY_IN_MILLISECONDS);

context("Endre dialogmøte", () => {
  beforeEach(() => {
    cy.stubMoter(MoteState.INNKALT_DIALOGMOTE);
    cy.visit("/sykefravaer/moteoversikt");
    cy.OAuth2Login();
  });

  xit("Tester feilhåndtering for manglende begrunnelse", () => {
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

  xit("Går til endre dialogmøte, sjekker forhåndsvisning og avbryter", () => {
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

    const day =
      TOMORROW.getUTCDate() < 10
        ? `0${TOMORROW.getUTCDate()}`
        : TOMORROW.getUTCDate();
    cy.get("[id=dato]")
      .clear()
      .type(
        `${day}.${TOMORROW.getUTCMonth() + 1}.${TOMORROW.getUTCFullYear()}`
      );

    cy.contains("Lagre endringer").click();

    cy.url().should("include", "/sykefravaer/moteoversikt");
  });
});
