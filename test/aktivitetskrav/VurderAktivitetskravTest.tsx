import { fireEvent, render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ValgtEnhetContext } from "@/context/ValgtEnhetContext";
import { navEnhet } from "../dialogmote/testData";
import React from "react";
import { VurderAktivitetskrav } from "@/components/aktivitetskrav/vurdering/VurderAktivitetskrav";
import { queryClientWithMockData } from "../testQueryClient";
import {
  createAktivitetskrav,
  generateOppfolgingstilfelle,
} from "../testDataUtils";
import {
  changeTextInput,
  clickButton,
  daysFromToday,
  getButton,
  getTextInput,
  getTooLongText,
  maxLengthErrorMessage,
} from "../testUtils";
import {
  AktivitetskravDTO,
  AktivitetskravStatus,
  AvventVurderingArsak,
  CreateAktivitetskravVurderingDTO,
  OppfyltVurderingArsak,
  UnntakVurderingArsak,
} from "@/data/aktivitetskrav/aktivitetskravTypes";
import { expect } from "chai";
import { vurderAktivitetskravBeskrivelseMaxLength } from "@/components/aktivitetskrav/vurdering/VurderAktivitetskravBeskrivelse";
import { tilLesbarPeriodeMedArUtenManednavn } from "@/utils/datoUtils";
import { OppfolgingstilfelleDTO } from "@/data/oppfolgingstilfelle/person/types/OppfolgingstilfellePersonDTO";

let queryClient: QueryClient;

const aktivitetskrav = createAktivitetskrav(
  daysFromToday(5),
  AktivitetskravStatus.NY
);
const tilfelleStart = daysFromToday(-50);
const tilfelleEnd = daysFromToday(50);
const oppfolgingstilfelle = generateOppfolgingstilfelle(
  tilfelleStart,
  tilfelleEnd
);

const avventButtonText = "(Avventer)";
const enBeskrivelse = "Her er en beskrivelse";
const unntakButtonText = "Sett unntak";
const oppfyltButtonText = "Er i aktivitet";
const ikkeOppfyltButtonText = "Ikke oppfylt";

const renderVurderAktivitetskrav = (
  aktivitetskravDto: AktivitetskravDTO | undefined,
  oppfolgingstilfelleDto: OppfolgingstilfelleDTO | undefined
) =>
  render(
    <QueryClientProvider client={queryClient}>
      <ValgtEnhetContext.Provider
        value={{ valgtEnhet: navEnhet.id, setValgtEnhet: () => void 0 }}
      >
        <VurderAktivitetskrav
          aktivitetskrav={aktivitetskravDto}
          oppfolgingstilfelle={oppfolgingstilfelleDto}
        />
      </ValgtEnhetContext.Provider>
    </QueryClientProvider>
  );
describe("VurderAktivitetskrav", () => {
  beforeEach(() => {
    queryClient = queryClientWithMockData();
  });
  it("renders buttons for vurdering av aktivitetskravet", () => {
    renderVurderAktivitetskrav(aktivitetskrav, oppfolgingstilfelle);
    expect(getButton(avventButtonText)).to.exist;
    expect(getButton(unntakButtonText)).to.exist;
    expect(getButton(oppfyltButtonText)).to.exist;
    expect(getButton(ikkeOppfyltButtonText)).to.exist;
  });
  it("renders periode for oppfølgingstilfelle", () => {
    renderVurderAktivitetskrav(aktivitetskrav, oppfolgingstilfelle);

    const periodeText = tilLesbarPeriodeMedArUtenManednavn(
      tilfelleStart,
      tilfelleEnd
    );
    expect(screen.getByText(`Gjelder tilfelle ${periodeText}`)).to.exist;
  });
  it("renders helptext tooltip", () => {
    renderVurderAktivitetskrav(aktivitetskrav, oppfolgingstilfelle);

    expect(screen.getByRole("tooltip")).to.exist;
  });
  describe("Oppfylt", () => {
    it("Validerer årsak og maks tegn beskrivelse", () => {
      renderVurderAktivitetskrav(aktivitetskrav, oppfolgingstilfelle);

      clickButton(oppfyltButtonText);
      const tooLongBeskrivelse = getTooLongText(
        vurderAktivitetskravBeskrivelseMaxLength
      );
      const beskrivelseInput = getTextInput("Beskrivelse");
      changeTextInput(beskrivelseInput, tooLongBeskrivelse);
      clickButton("Lagre");

      expect(screen.getByText("Vennligst angi årsak")).to.exist;
      expect(
        screen.getByText(
          maxLengthErrorMessage(vurderAktivitetskravBeskrivelseMaxLength)
        )
      ).to.exist;
    });
    it("Lagre vurdering med verdier fra skjema", () => {
      renderVurderAktivitetskrav(aktivitetskrav, oppfolgingstilfelle);

      clickButton(oppfyltButtonText);

      expect(screen.getByRole("heading", { name: "Er i aktivitet" })).to.exist;

      const arsakRadioButton = screen.getByText("Friskmeldt");
      fireEvent.click(arsakRadioButton);
      const beskrivelseInput = getTextInput("Beskrivelse");
      changeTextInput(beskrivelseInput, enBeskrivelse);
      clickButton("Lagre");

      const vurderOppfyltMutation = queryClient.getMutationCache().getAll()[0];
      const expectedVurdering: CreateAktivitetskravVurderingDTO = {
        beskrivelse: enBeskrivelse,
        status: AktivitetskravStatus.OPPFYLT,
        arsaker: [OppfyltVurderingArsak.FRISKMELDT],
      };
      expect(vurderOppfyltMutation.options.variables).to.deep.equal(
        expectedVurdering
      );
    });
  });
  describe("Unntak", () => {
    it("Validerer årsak og maks tegn beskrivelse", () => {
      renderVurderAktivitetskrav(aktivitetskrav, oppfolgingstilfelle);

      clickButton(unntakButtonText);
      const tooLongBeskrivelse = getTooLongText(
        vurderAktivitetskravBeskrivelseMaxLength
      );
      const beskrivelseInput = getTextInput("Beskrivelse");
      changeTextInput(beskrivelseInput, tooLongBeskrivelse);
      clickButton("Lagre");

      expect(screen.getByText("Vennligst angi årsak")).to.exist;
      expect(
        screen.getByText(
          maxLengthErrorMessage(vurderAktivitetskravBeskrivelseMaxLength)
        )
      ).to.exist;
    });
    it("Lagre vurdering med verdier fra skjema", () => {
      renderVurderAktivitetskrav(aktivitetskrav, oppfolgingstilfelle);

      clickButton(unntakButtonText);

      expect(
        screen.getByRole("heading", {
          name: "Sett unntak fra aktivitetskravet",
        })
      ).to.exist;

      const arsakRadioButton = screen.getByText("Tilrettelegging ikke mulig");
      fireEvent.click(arsakRadioButton);
      const beskrivelseInput = getTextInput("Beskrivelse");
      changeTextInput(beskrivelseInput, enBeskrivelse);
      clickButton("Lagre");

      const vurderUnntakMutation = queryClient.getMutationCache().getAll()[0];
      const expectedVurdering: CreateAktivitetskravVurderingDTO = {
        beskrivelse: enBeskrivelse,
        status: AktivitetskravStatus.UNNTAK,
        arsaker: [UnntakVurderingArsak.TILRETTELEGGING_IKKE_MULIG],
      };
      expect(vurderUnntakMutation.options.variables).to.deep.equal(
        expectedVurdering
      );
    });
  });
  describe("Avvent", () => {
    it("Validerer årsaker og beskrivelse", () => {
      renderVurderAktivitetskrav(aktivitetskrav, oppfolgingstilfelle);

      clickButton(avventButtonText);
      clickButton("Lagre");

      expect(screen.getByText("Vennligst angi beskrivelse")).to.exist;
      expect(screen.getByText("Vennligst angi årsak")).to.exist;
    });
    it("Lagre vurdering med verdier fra skjema", () => {
      renderVurderAktivitetskrav(aktivitetskrav, oppfolgingstilfelle);

      clickButton(avventButtonText);

      expect(
        screen.getByRole("heading", {
          name: "Avventer",
        })
      ).to.exist;

      const arsakOppfolgingsplanRadioButton = screen.getByText(
        "Har bedt om oppfølgingsplan fra arbeidsgiver"
      );
      fireEvent.click(arsakOppfolgingsplanRadioButton);
      const arsakBehandlerRadioButton = screen.getByText(
        "Har bedt om mer informasjon fra behandler"
      );
      fireEvent.click(arsakBehandlerRadioButton);
      const beskrivelseInput = getTextInput("Beskrivelse (obligatorisk)");
      changeTextInput(beskrivelseInput, enBeskrivelse);
      clickButton("Lagre");

      const vurderAvventMutation = queryClient.getMutationCache().getAll()[0];
      const expectedVurdering: CreateAktivitetskravVurderingDTO = {
        beskrivelse: enBeskrivelse,
        status: AktivitetskravStatus.AVVENT,
        arsaker: [
          AvventVurderingArsak.OPPFOLGINGSPLAN_ARBEIDSGIVER,
          AvventVurderingArsak.INFORMASJON_BEHANDLER,
        ],
      };
      expect(vurderAvventMutation.options.variables).to.deep.equal(
        expectedVurdering
      );
    });
  });
  describe("Ikke oppfylt", () => {
    it("Lagre vurdering med verdier fra skjema", () => {
      renderVurderAktivitetskrav(aktivitetskrav, oppfolgingstilfelle);

      clickButton(ikkeOppfyltButtonText);

      expect(
        screen.getByRole("heading", {
          name: "Ikke oppfylt",
        })
      ).to.exist;

      expect(
        screen.getByText(/Innstilling må skrives og sendes til NAY i Gosys/)
      ).to.exist;
      clickButton("Lagre");

      const vurderAvventMutation = queryClient.getMutationCache().getAll()[0];
      const expectedVurdering: CreateAktivitetskravVurderingDTO = {
        status: AktivitetskravStatus.IKKE_OPPFYLT,
        arsaker: [],
        beskrivelse: undefined,
      };
      expect(vurderAvventMutation.options.variables).to.deep.equal(
        expectedVurdering
      );
    });
  });
  describe("Uten oppfølgingstilfelle med aktivitetskrav", () => {
    it("Lagre vurdering med verdier fra skjema", () => {
      renderVurderAktivitetskrav(undefined, undefined);

      expect(screen.queryByText(/Gjelder tilfelle/)).to.not.exist;

      clickButton(unntakButtonText);

      const arsakRadioButton = screen.getByText("Medisinske grunner");
      fireEvent.click(arsakRadioButton);
      const beskrivelseInput = getTextInput("Beskrivelse");
      changeTextInput(beskrivelseInput, enBeskrivelse);
      clickButton("Lagre");

      const vurderUnntakMutation = queryClient.getMutationCache().getAll()[0];
      const expectedVurdering: CreateAktivitetskravVurderingDTO = {
        beskrivelse: enBeskrivelse,
        status: AktivitetskravStatus.UNNTAK,
        arsaker: [UnntakVurderingArsak.MEDISINSKE_GRUNNER],
      };
      expect(vurderUnntakMutation.options.variables).to.deep.equal(
        expectedVurdering
      );
    });
  });
});
