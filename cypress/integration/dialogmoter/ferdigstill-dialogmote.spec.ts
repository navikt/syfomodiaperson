import { MoteState } from "../../support/motelandingsside-commands";
import { selectors } from "../../support/constants";

const texts = {
  situasjon: "Min situasjon",
  konklusjon: "Konkluderer",
  arbeidstakersOppgave: "Jobbe",
  arbeidsgiversOppgave: "Tekst",
};

context("Ferdigstill dialogmøte", () => {
  beforeEach(() => {
    cy.stubEndepunkter(MoteState.INNKALT_DIALOGMOTE);
    cy.visit("/sykefravaer/moteoversikt");
    cy.OAuth2Login();
  });

  it("Går til skriv referat, sjekker forhåndsvisning og avbryter", () => {
    cy.contains("Skriv referat").click();

    cy.dataCy(selectors.situasjonTextArea).type(texts.situasjon);
    cy.dataCy(selectors.konklusjonTextArea).type(texts.konklusjon);
    cy.dataCy(selectors.arbeidstakersOppgaveTextArea).type(
      texts.arbeidstakersOppgave
    );
    cy.dataCy(selectors.arbeidsgiversOppgaveTextArea).type(
      texts.arbeidsgiversOppgave
    );
    cy.contains("Ikke behov for bistand fra NAV nå").click();

    cy.contains("Se forhåndsvisning").click();
    cy.dataCy(selectors.forhandsvisningModal).contains(texts.situasjon);
    cy.dataCy(selectors.forhandsvisningModal).contains(texts.konklusjon);
    cy.dataCy(selectors.forhandsvisningModal).contains(
      texts.arbeidstakersOppgave
    );
    cy.dataCy(selectors.forhandsvisningModal).contains(
      texts.arbeidsgiversOppgave
    );
    cy.dataCy(selectors.forhandsvisningModal).contains(
      "Slik situasjonen er nå, er det ikke behov for noen spesiell bistand fra NAV. Dere kan likevel be om nytt dialogmøte når dere har behov for det."
    );
    cy.contains("Lukk").click();

    cy.contains("Avbryt").click();
    cy.get(".sidetopp__tittel").contains("Dialogmøter");
  });

  it("Går til skriv referat, sjekker valideringsfeil, skriver referat og sender inn", () => {
    cy.contains("Skriv referat").click();

    cy.contains("Lagre og send").click();

    cy.contains("For å gå videre må du rette opp følgende:");

    cy.dataCy(selectors.situasjonTextArea).type(texts.situasjon);
    cy.dataCy(selectors.konklusjonTextArea).type(texts.konklusjon);
    cy.dataCy(selectors.arbeidstakersOppgaveTextArea).type(
      texts.arbeidstakersOppgave
    );
    cy.dataCy(selectors.arbeidsgiversOppgaveTextArea).type(
      texts.arbeidsgiversOppgave
    );

    cy.contains("Lagre og send").click();

    cy.url().should("include", "/sykefravaer/moteoversikt");
  });
});
