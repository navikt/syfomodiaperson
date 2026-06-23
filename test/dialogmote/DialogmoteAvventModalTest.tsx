import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { queryClientWithMockData } from "../testQueryClient";
import { DialogmoteAvventModal } from "@/sider/dialogmoter/components/innkalling/DialogmoteAvventModal";
import dayjs from "dayjs";
import { toDatePrettyPrint } from "@/utils/datoUtils.ts";

let queryClient: QueryClient;

const renderDialogmoteAvventModal = (
  isKandidat: boolean,
  onClose: () => void = () => undefined,
) =>
  render(
    <QueryClientProvider client={queryClient}>
      <DialogmoteAvventModal isKandidat={isKandidat} isOpen onClose={onClose} />
    </QueryClientProvider>,
  );

describe("DialogmoteAvventModal", () => {
  beforeEach(() => {
    queryClient = queryClientWithMockData();
  });

  it("validerer at begrunnelse og frist er påkrevd med isKandidat: true", async () => {
    renderDialogmoteAvventModal(true);

    const now = new Date();
    const inTwoMonths = dayjs(now).add(2, "months").toDate();
    const dateString = toDatePrettyPrint(inTwoMonths);

    const lagreButton = await screen.findByRole("button", { name: "Lagre" });
    await userEvent.click(lagreButton);

    expect(await screen.findByText("Begrunnelse mangler")).to.exist;
    expect(
      await screen.findByText(/Vennligst angi en gyldig dato i intervallet/),
    ).to.exist;
    if (dateString)
      expect(await screen.findByText(dateString, { exact: false })).to.exist;
  });

  it("validerer at begrunnelse og frist er påkrevd med isKandidat: false", async () => {
    renderDialogmoteAvventModal(false);

    const now = new Date();
    const inThreeWeeks = dayjs(now).add(3, "weeks").toDate();
    const dateString = toDatePrettyPrint(inThreeWeeks);

    const lagreButton = await screen.findByRole("button", { name: "Lagre" });
    await userEvent.click(lagreButton);

    expect(await screen.findByText("Begrunnelse mangler")).to.exist;
    expect(
      await screen.findByText(/Vennligst angi en gyldig dato i intervallet/),
    ).to.exist;
    if (dateString)
      expect(await screen.findByText(dateString, { exact: false })).to.exist;
  });

  it("lukker modalen når skjemaet sendes inn med gyldige verdier", async () => {
    const onClose = vi.fn();
    renderDialogmoteAvventModal(false, onClose);

    const begrunnelseInput = screen.getByLabelText("Beskrivelse");
    await userEvent.type(begrunnelseInput, "En utfyllende begrunnelse");

    const fristInput = screen.getByLabelText("Avventer til");
    const fristDate = dayjs().add(1, "day");
    await userEvent.clear(fristInput);
    await userEvent.type(fristInput, fristDate.format("DD.MM.YYYY"));

    const lagreButton = screen.getByRole("button", { name: "Lagre" });
    await userEvent.click(lagreButton);
    expect(screen.queryByRole("dialog", { name: "Avvent" })).toBeNull();
  });
});
