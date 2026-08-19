import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import { http, HttpResponse } from "msw";
import { mockServer } from "../setup";
import { queryClientWithMockData } from "../testQueryClient";
import { ISUTENLANDSOPPHOLD_ROOT } from "@/apiConstants";
import { UtenlandsoppholdSoknad } from "@/sider/utenlandsopphold/UtenlandsoppholdSoknad.tsx";
import { UtenlandsoppholdSoknader } from "@/sider/utenlandsopphold/UtenlandsoppholdSoknader.tsx";
import { utenlandsoppholdQueryKeys } from "@/data/utenlandsopphold/utenlandsoppholdQueryHooks";
import { SoknadVedtakPostDTO } from "@/data/utenlandsopphold/utenlandsoppholdTypes";
import {
  ARBEIDSTAKER_DEFAULT,
  VEILEDER_DEFAULT,
} from "@/mocks/common/mockConstants";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { NotificationProvider } from "@/context/notification/NotificationContext";
import {
  mockSoknaderResponse,
  soknadMedVedtakMock,
  soknadUtenVedtakMock,
} from "@/mocks/isutenlandsopphold/mockIsutenlandsopphold";
import { maksdatoMock } from "@/mocks/syfoperson/persondataMock";
import { utenlandsoppholdPath } from "@/AppRouter.tsx";
import {
  changeTextInput,
  clickButton,
  clickRadio,
  getTextInput,
} from "../testUtils";
import {
  stubSoknaderMedMuterbarTilstand,
  stubSoknaderQuery,
} from "../stubs/stubIsutenlandsopphold";
import { maksdatoQueryKeys } from "@/data/maksdato/useMaksdatoQuery";

let queryClient: QueryClient;
const forbeholdOvrigeVilkarText =
  "Dette vedtaket gir ikke rett på utbetaling av ytelsen sykepenger, men gir deg rett til å beholde sykepengene under utenlandsopphold.";

const renderUtenlandsoppholdSoknad = (
  soknadId: string = soknadUtenVedtakMock.soknadId,
  initialPath: string = `${utenlandsoppholdPath}/${soknadId}`,
) =>
  render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[initialPath]}>
        <NotificationProvider>
          <Routes>
            <Route
              path={`${utenlandsoppholdPath}/:utenlandsoppholdSoknadId`}
              element={<UtenlandsoppholdSoknad />}
            />
            <Route
              path={utenlandsoppholdPath}
              element={<UtenlandsoppholdSoknader />}
            />
          </Routes>
        </NotificationProvider>
      </MemoryRouter>
    </QueryClientProvider>,
  );

describe("UtenlandsoppholdSoknad", () => {
  beforeEach(() => {
    queryClient = queryClientWithMockData();
  });

  it("viser feilmelding når henting av søknader feiler", async () => {
    queryClient.setQueryDefaults(
      utenlandsoppholdQueryKeys.soknader(ARBEIDSTAKER_DEFAULT.personIdent),
      { retry: false },
    );

    renderUtenlandsoppholdSoknad();

    expect(
      await screen.findByText(
        "Noe gikk galt ved henting av søknader. Vennligst prøv igjen senere.",
      ),
    ).to.exist;
  });

  it("viser melding om at søknaden mangler når listen er tom", async () => {
    stubSoknaderQuery({ soknader: [] });

    renderUtenlandsoppholdSoknad();

    expect(await screen.findByText("Fant ikke søknaden")).to.exist;
  });

  it("viser søkte perioder og knapp for å sende vedtak", async () => {
    stubSoknaderQuery({ soknader: [soknadUtenVedtakMock] });

    renderUtenlandsoppholdSoknad();

    expect(await screen.findByRole("button", { name: "Send vedtak" })).to.exist;
    expect(screen.getByRole("button", { name: "Forhåndsvisning" })).to.exist;
    expect(screen.getByRole("button", { name: "Vis hele søknaden" })).to.exist;
    expect(screen.getByRole("button", { name: "Tilbake" })).to.exist;
  });

  it("apner forhandsvisning med Bekreft og send-knapp og sender ikke vedtak for utfallet er bekreftet", async () => {
    stubSoknaderQuery({ soknader: [soknadUtenVedtakMock] });

    renderUtenlandsoppholdSoknad();

    await screen.findByRole("button", { name: "Send vedtak" });
    await clickRadio("Innvilget: Godkjenn hele perioden");
    await clickButton("Send vedtak");

    expect(await screen.findByRole("button", { name: "Bekreft og send" })).to
      .exist;
    await waitFor(() => {
      expect(queryClient.getMutationCache().getAll()).to.have.lengthOf(0);
    });

    await clickButton("Bekreft og send");

    await waitFor(() => {
      const vedtakMutation = queryClient.getMutationCache().getAll()[0];
      expect(vedtakMutation).to.exist;
    });
  });

  it("viser melding om at søknaden er behandlet når status ikke er MOTTATT", async () => {
    stubSoknaderQuery({ soknader: [soknadMedVedtakMock] });

    renderUtenlandsoppholdSoknad(soknadMedVedtakMock.soknadId);

    expect(await screen.findByText(/Denne søknaden er allerede behandlet/)).to
      .exist;
  });

  it("sender innvilget vedtak, viser notifikasjon og navigerer tilbake til listen der søknadens status nå vises som innvilget", async () => {
    stubSoknaderMedMuterbarTilstand(mockSoknaderResponse.soknader);
    queryClient.setQueryData(
      maksdatoQueryKeys.maksdato(ARBEIDSTAKER_DEFAULT.personIdent),
      () => ({
        maxDate: {
          ...maksdatoMock.maxDate,
          utbetalt_tom: new Date("2026-08-01"),
        },
      }),
    );

    renderUtenlandsoppholdSoknad(
      soknadUtenVedtakMock.soknadId,
      utenlandsoppholdPath,
    );

    expect(await screen.findByRole("button", { name: "Start behandling" })).to
      .exist;

    await clickButton("Start behandling");

    await clickRadio("Innvilget: Godkjenn hele perioden");

    await screen.findByRole("button", { name: "Send vedtak" });
    await clickButton("Send vedtak");
    await clickButton("Bekreft og send");

    expect(
      await screen.findByText(
        "Vedtaket om utenlandsopphold utenfor EU/EØS er fattet og sendt til bruker. Dokumentet er journalført i Gosys.",
      ),
    ).to.exist;
    expect(screen.queryByText("Fant ikke søknaden")).to.not.exist;
    expect(screen.queryByRole("button", { name: "Start behandling" })).to.not
      .exist;
    expect(await screen.findAllByText("Innvilget")).to.have.lengthOf(2);
    expect(
      await screen.findAllByText(
        new RegExp(`^Behandlet .* av ${VEILEDER_DEFAULT.ident}$`),
      ),
    ).to.have.lengthOf(2);

    await waitFor(() => {
      const vedtakMutation = queryClient.getMutationCache().getAll()[0];
      const variables = vedtakMutation.state.variables as {
        soknadId: string;
        vedtak: SoknadVedtakPostDTO;
      };
      expect(
        variables.vedtak.document.some((component) =>
          component.texts.includes(forbeholdOvrigeVilkarText),
        ),
      ).to.equal(false);
    });
  });

  it("viser varsel til veileder og legger ved forbeholdstekst ved innvilgelse når sykepenger ikke er utbetalt", async () => {
    stubSoknaderMedMuterbarTilstand(mockSoknaderResponse.soknader);
    queryClient.setQueryData(
      maksdatoQueryKeys.maksdato(ARBEIDSTAKER_DEFAULT.personIdent),
      () => ({ maxDate: null }),
    );

    renderUtenlandsoppholdSoknad(
      soknadUtenVedtakMock.soknadId,
      utenlandsoppholdPath,
    );

    expect(await screen.findByRole("button", { name: "Start behandling" })).to
      .exist;

    await clickButton("Start behandling");

    expect(await screen.findByText(/Sykepenger er ikke utbetalt\./)).to.exist;

    await clickRadio("Innvilget: Godkjenn hele perioden");
    await clickButton("Send vedtak");
    await clickButton("Bekreft og send");

    await waitFor(() => {
      const vedtakMutation = queryClient.getMutationCache().getAll()[0];
      const variables = vedtakMutation.state.variables as {
        soknadId: string;
        vedtak: SoknadVedtakPostDTO;
      };
      expect(
        variables.vedtak.document.some((component) =>
          component.texts.includes(forbeholdOvrigeVilkarText),
        ),
      ).to.equal(true);
    });
  });

  it("viser varsel og forbehold når utbetalingen skjedde før siste oppfolgingstilfelle startet", async () => {
    stubSoknaderMedMuterbarTilstand(mockSoknaderResponse.soknader);
    queryClient.setQueryData(
      maksdatoQueryKeys.maksdato(ARBEIDSTAKER_DEFAULT.personIdent),
      () => ({
        maxDate: {
          ...maksdatoMock.maxDate,
          utbetalt_tom: new Date("2020-01-01"),
        },
      }),
    );

    renderUtenlandsoppholdSoknad(
      soknadUtenVedtakMock.soknadId,
      utenlandsoppholdPath,
    );

    expect(await screen.findByRole("button", { name: "Start behandling" })).to
      .exist;

    await clickButton("Start behandling");

    expect(await screen.findByText(/Sykepenger er ikke utbetalt\./)).to.exist;

    await clickRadio("Innvilget: Godkjenn hele perioden");
    await clickButton("Send vedtak");
    await clickButton("Bekreft og send");

    await waitFor(() => {
      const vedtakMutation = queryClient.getMutationCache().getAll()[0];
      const variables = vedtakMutation.state.variables as {
        soknadId: string;
        vedtak: SoknadVedtakPostDTO;
      };
      expect(
        variables.vedtak.document.some((component) =>
          component.texts.includes(forbeholdOvrigeVilkarText),
        ),
      ).to.equal(true);
    });
  });

  it("sender avslag vedtak, viser notifikasjon og navigerer tilbake til listen der søknadens status nå vises som avslag", async () => {
    stubSoknaderMedMuterbarTilstand(mockSoknaderResponse.soknader);

    renderUtenlandsoppholdSoknad(
      soknadUtenVedtakMock.soknadId,
      utenlandsoppholdPath,
    );

    expect(await screen.findByRole("button", { name: "Start behandling" })).to
      .exist;

    await clickButton("Start behandling");

    await clickRadio("Avslag: Avslå hele perioden");

    changeTextInput(
      getTextInput("Begrunnelse (obligatorisk)"),
      "Vurdering av avslag",
    );

    await screen.findByRole("button", { name: "Send vedtak" });
    await clickButton("Send vedtak");
    await clickButton("Bekreft og send");

    expect(
      await screen.findByText(
        "Vedtaket om utenlandsopphold utenfor EU/EØS er fattet og sendt til bruker. Dokumentet er journalført i Gosys.",
      ),
    ).to.exist;
    expect(screen.queryByText("Fant ikke søknaden")).to.not.exist;
    expect(screen.queryByRole("button", { name: "Start behandling" })).to.not
      .exist;
    expect(await screen.findAllByText("Avslag")).to.have.lengthOf(1);
    expect(
      await screen.findAllByText(
        new RegExp(`^Behandlet .* av ${VEILEDER_DEFAULT.ident}$`),
      ),
    ).to.have.lengthOf(2);

    await waitFor(() => {
      const vedtakMutation = queryClient.getMutationCache().getAll()[0];
      const variables = vedtakMutation.state.variables as {
        soknadId: string;
        vedtak: SoknadVedtakPostDTO;
      };
      expect(variables.vedtak.begrunnelse).to.equal("Vurdering av avslag");
      expect(
        variables.vedtak.document.some((component) =>
          component.texts.includes("Vurdering av avslag"),
        ),
      ).to.equal(true);
      // Hele søknadsperioden avslås, siden det ikke er valgt noen innvilgede perioder
      expect(
        variables.vedtak.document.some((component) =>
          component.texts.some(
            (text) =>
              text.includes("01.06.2026 til og med 07.06.2026") &&
              text.includes("10.06.2026 til og med 12.06.2026"),
          ),
        ),
      ).to.equal(true);
    });
  });

  describe("Delvis innvilgelse", () => {
    it("viser periode-velger for delvis innvilgelse kun når det utfallet er valgt", async () => {
      stubSoknaderQuery({ soknader: [soknadUtenVedtakMock] });

      renderUtenlandsoppholdSoknad();

      await screen.findByRole("button", { name: "Send vedtak" });

      expect(screen.queryByRole("textbox", { name: "Fra og med dato" })).to.not
        .exist;

      await clickRadio("Delvis innvilget: Godkjenn deler av perioden");

      expect(await screen.findByRole("textbox", { name: "Fra og med dato" })).to
        .exist;
      expect(screen.getByRole("textbox", { name: "Til og med dato" })).to.exist;

      await clickRadio("Innvilget: Godkjenn hele perioden");

      expect(screen.queryByRole("textbox", { name: "Fra og med dato" })).to.not
        .exist;
    });

    it("viser valideringsfeil og sender ikke vedtak når delvis innvilgelse er valgt uten periode", async () => {
      stubSoknaderQuery({ soknader: [soknadUtenVedtakMock] });

      renderUtenlandsoppholdSoknad();

      await screen.findByRole("button", { name: "Send vedtak" });
      await clickRadio("Delvis innvilget: Godkjenn deler av perioden");
      await clickButton("Send vedtak");

      expect(
        await screen.findAllByText("Vennligst angi periode"),
      ).to.have.lengthOf(2);

      await waitFor(() => {
        expect(queryClient.getMutationCache().getAll()).to.have.lengthOf(0);
      });
    });

    it("viser ikke valideringsfeil på fom-feltet mens brukeren fortsatt bare har satt tom-feltet", async () => {
      stubSoknaderQuery({ soknader: [soknadUtenVedtakMock] });

      renderUtenlandsoppholdSoknad();

      await screen.findByRole("button", { name: "Send vedtak" });
      await clickRadio("Delvis innvilget: Godkjenn deler av perioden");

      const tomInput = getTextInput("Til og med dato");
      changeTextInput(tomInput, "05.06.2026");

      expect(screen.queryByText("Vennligst angi periode")).to.not.exist;
    });

    it("viser valideringsfeil og sender ikke vedtak når valgt periode krysser datoer det ikke er søkt om", async () => {
      stubSoknaderQuery({ soknader: [soknadUtenVedtakMock] });

      renderUtenlandsoppholdSoknad();

      await screen.findByRole("button", { name: "Send vedtak" });
      await clickRadio("Delvis innvilget: Godkjenn deler av perioden");

      const fomInput = getTextInput("Fra og med dato");
      const tomInput = getTextInput("Til og med dato");
      // 05.06.2026 - 11.06.2026 krysser hullet 08.06.2026-09.06.2026 mellom soktePerioder
      changeTextInput(fomInput, "05.06.2026");
      changeTextInput(tomInput, "11.06.2026");

      await screen.findByRole("button", { name: "Send vedtak" });
      await clickButton("Send vedtak");

      expect(
        await screen.findAllByText(
          "Perioden kan ikke krysse datoer det ikke er søkt om",
        ),
      ).to.have.lengthOf(2);

      await waitFor(() => {
        expect(queryClient.getMutationCache().getAll()).to.have.lengthOf(0);
      });
    });

    it("sender delvis innvilget vedtak med valgt periode, viser notifikasjon og navigerer tilbake til listen der søknadens status nå vises som delvis innvilget", async () => {
      stubSoknaderMedMuterbarTilstand(mockSoknaderResponse.soknader);

      renderUtenlandsoppholdSoknad(
        soknadUtenVedtakMock.soknadId,
        utenlandsoppholdPath,
      );

      expect(await screen.findByRole("button", { name: "Start behandling" })).to
        .exist;

      await clickButton("Start behandling");

      await clickRadio("Delvis innvilget: Godkjenn deler av perioden");

      const fomInput = getTextInput("Fra og med dato");
      const tomInput = getTextInput("Til og med dato");
      changeTextInput(fomInput, "02.06.2026");
      changeTextInput(tomInput, "05.06.2026");
      changeTextInput(
        getTextInput("Begrunnelse (obligatorisk)"),
        "Vurdering av delvis innvilgelse",
      );

      await screen.findByRole("button", { name: "Send vedtak" });
      await clickButton("Send vedtak");
      await clickButton("Bekreft og send");

      expect(
        await screen.findByText(
          "Vedtaket om utenlandsopphold utenfor EU/EØS er fattet og sendt til bruker. Dokumentet er journalført i Gosys.",
        ),
      ).to.exist;
      expect(screen.queryByText("Fant ikke søknaden")).to.not.exist;
      expect(screen.queryByRole("button", { name: "Start behandling" })).to.not
        .exist;
      expect(await screen.findAllByText("Delvis innvilget")).to.have.lengthOf(
        1,
      );
      expect(
        await screen.findAllByText(
          new RegExp(`^Behandlet .* av ${VEILEDER_DEFAULT.ident}$`),
        ),
      ).to.have.lengthOf(2);

      await waitFor(() => {
        const vedtakMutation = queryClient.getMutationCache().getAll()[0];
        const variables = vedtakMutation.state.variables as {
          soknadId: string;
          vedtak: SoknadVedtakPostDTO;
        };
        expect(variables.vedtak.begrunnelse).to.equal(
          "Vurdering av delvis innvilgelse",
        );
        expect(
          variables.vedtak.document.some((component) =>
            component.texts.includes("Vurdering av delvis innvilgelse"),
          ),
        ).to.equal(true);
        // Innvilget periode 02.06-05.06 fører til at resten av søknadsperiodene avslås
        expect(
          variables.vedtak.document.some((component) =>
            component.texts.some(
              (text) =>
                text.includes("02.06.2026 til og med 05.06.2026") &&
                !text.includes("01.06.2026"),
            ),
          ),
        ).to.equal(true);
      });
    });

    it("kan legge til og fjerne flere godkjente perioder", async () => {
      stubSoknaderQuery({ soknader: [soknadUtenVedtakMock] });

      renderUtenlandsoppholdSoknad();

      await screen.findByRole("button", { name: "Send vedtak" });
      await clickRadio("Delvis innvilget: Godkjenn deler av perioden");

      await screen.findByRole("textbox", { name: "Fra og med dato" });
      expect(screen.queryByRole("button", { name: "Slett ikon" })).to.not.exist;

      await clickButton("Pluss ikon Legg til flere godkjente perioder");

      expect(
        await screen.findAllByRole("textbox", { name: "Fra og med dato" }),
      ).to.have.lengthOf(2);
      const fjernKnapper = screen.getAllByRole("button", {
        name: "Slett ikon",
      });
      expect(fjernKnapper).to.have.lengthOf(2);

      await userEvent.click(fjernKnapper[0]);

      await waitFor(() => {
        expect(
          screen.getAllByRole("textbox", { name: "Fra og med dato" }),
        ).to.have.lengthOf(1);
      });
      expect(screen.queryByRole("button", { name: "Slett ikon" })).to.not.exist;
    });

    it("viser valideringsfeil og sender ikke vedtak når to valgte perioder overlapper hverandre", async () => {
      stubSoknaderQuery({ soknader: [soknadUtenVedtakMock] });

      renderUtenlandsoppholdSoknad();

      await screen.findByRole("button", { name: "Send vedtak" });
      await clickRadio("Delvis innvilget: Godkjenn deler av perioden");
      await clickButton("Pluss ikon Legg til flere godkjente perioder");

      const fomInputs = await screen.findAllByRole("textbox", {
        name: "Fra og med dato",
      });
      const tomInputs = screen.getAllByRole("textbox", {
        name: "Til og med dato",
      });
      // Begge periodene ligger innenfor 01.06.2026-07.06.2026, men overlapper hverandre
      changeTextInput(fomInputs[0], "01.06.2026");
      changeTextInput(tomInputs[0], "05.06.2026");
      changeTextInput(fomInputs[1], "03.06.2026");
      changeTextInput(tomInputs[1], "06.06.2026");

      await clickButton("Send vedtak");

      expect(
        await screen.findAllByText(
          "Perioden kan ikke overlappe med en annen periode du har lagt til",
        ),
      ).to.have.lengthOf(4);

      await waitFor(() => {
        expect(queryClient.getMutationCache().getAll()).to.have.lengthOf(0);
      });
    });

    it("viser advarsel om at ingen perioder avslås når valgte perioder er like søkte perioder", async () => {
      stubSoknaderQuery({ soknader: [soknadUtenVedtakMock] });

      renderUtenlandsoppholdSoknad();

      await screen.findByRole("button", { name: "Send vedtak" });
      await clickRadio("Delvis innvilget: Godkjenn deler av perioden");
      await clickButton("Pluss ikon Legg til flere godkjente perioder");

      const fomInputs = await screen.findAllByRole("textbox", {
        name: "Fra og med dato",
      });
      const tomInputs = screen.getAllByRole("textbox", {
        name: "Til og med dato",
      });
      // Perioden matcher nøyaktig soknadUtenVedtakMock sine soktePerioder
      changeTextInput(fomInputs[0], "01.06.2026");
      changeTextInput(tomInputs[0], "07.06.2026");
      changeTextInput(fomInputs[1], "10.06.2026");
      changeTextInput(tomInputs[1], "12.06.2026");

      expect(
        await screen.findByText(
          "Du har valgt å innvilge alle perioder. Velg 'Innvilgelse' som utfall i stedet for 'Delvis innvilgelse'",
        ),
      ).to.exist;
      expect(
        screen.getByRole("button", { name: "Send vedtak" }),
      ).to.have.property("disabled", true);
    });

    it("sender delvis innvilget vedtak med flere valgte perioder", async () => {
      stubSoknaderMedMuterbarTilstand(mockSoknaderResponse.soknader);

      renderUtenlandsoppholdSoknad(
        soknadUtenVedtakMock.soknadId,
        utenlandsoppholdPath,
      );

      expect(await screen.findByRole("button", { name: "Start behandling" })).to
        .exist;

      await clickButton("Start behandling");

      await clickRadio("Delvis innvilget: Godkjenn deler av perioden");
      await screen.findByRole("textbox", { name: "Fra og med dato" });
      await clickButton("Pluss ikon Legg til flere godkjente perioder");

      const fomInputs = await screen.findAllByRole("textbox", {
        name: "Fra og med dato",
      });
      const tomInputs = screen.getAllByRole("textbox", {
        name: "Til og med dato",
      });
      changeTextInput(fomInputs[0], "02.06.2026");
      changeTextInput(tomInputs[0], "05.06.2026");
      changeTextInput(fomInputs[1], "10.06.2026");
      changeTextInput(tomInputs[1], "12.06.2026");
      changeTextInput(
        getTextInput("Begrunnelse (obligatorisk)"),
        "Vurdering av delvis innvilgelse",
      );

      await clickButton("Send vedtak");
      await clickButton("Bekreft og send");

      expect(
        await screen.findByText(
          "Vedtaket om utenlandsopphold utenfor EU/EØS er fattet og sendt til bruker. Dokumentet er journalført i Gosys.",
        ),
      ).to.exist;

      await waitFor(() => {
        const vedtakMutation = queryClient.getMutationCache().getAll()[0];
        const variables = vedtakMutation.state.variables as {
          soknadId: string;
          vedtak: SoknadVedtakPostDTO;
        };
        expect(variables.vedtak.utfall).to.equal("DELVIS_INNVILGET");
        expect(variables.vedtak.innvilgedePerioder).to.deep.equal([
          {
            fom: "2026-06-02",
            tom: "2026-06-05",
          },
          {
            fom: "2026-06-10",
            tom: "2026-06-12",
          },
        ]);
      });
    });
  });

  it("viser valideringsfeil og sender ikke vedtak når ingen utfall er valgt", async () => {
    stubSoknaderQuery({ soknader: [soknadUtenVedtakMock] });

    renderUtenlandsoppholdSoknad();

    await screen.findByRole("button", { name: "Send vedtak" });
    await clickButton("Send vedtak");

    expect(
      await screen.findByText("Du må velge et utfall for å fatte vedtaket"),
    ).to.exist;

    await waitFor(() => {
      expect(queryClient.getMutationCache().getAll()).to.have.lengthOf(0);
    });
  });

  it("navigerer ikke bort og viser ingen notifikasjon hvis sending av vedtak feiler", async () => {
    stubSoknaderQuery({ soknader: [soknadUtenVedtakMock] });
    mockServer.use(
      http.post(
        `*${ISUTENLANDSOPPHOLD_ROOT}/soknader/:soknadId/vedtak`,
        () => new HttpResponse(null, { status: 500 }),
      ),
    );

    renderUtenlandsoppholdSoknad();

    await screen.findByRole("button", { name: "Send vedtak" });
    await clickRadio("Innvilget: Godkjenn hele perioden");
    await clickButton("Send vedtak");
    await clickButton("Bekreft og send");

    await waitFor(() => {
      const vedtakMutation = queryClient.getMutationCache().getAll().pop();
      expect(vedtakMutation?.state.status).to.equal("error");
    });
    expect(screen.getByRole("button", { name: "Send vedtak" })).to.exist;
  });
});
