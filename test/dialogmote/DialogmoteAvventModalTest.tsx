import React from "react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { queryClientWithMockData } from "../testQueryClient";
import { DialogmoteAvventModal } from "@/sider/dialogmoter/components/innkalling/DialogmoteAvventModal";
import dayjs from "dayjs";

let queryClient: QueryClient;

const renderDialogmoteAvventModal = (onClose: () => void = () => undefined) =>
  render(
    <QueryClientProvider client={queryClient}>
      <DialogmoteAvventModal isOpen onClose={onClose} />
    </QueryClientProvider>
  );

describe("DialogmoteAvventModal", () => {
  beforeEach(() => {
    queryClient = queryClientWithMockData();
  });

  it("validerer at begrunnelse og frist er påkrevd", async () => {
    renderDialogmoteAvventModal();

    const lagreButton = await screen.findByRole("button", { name: "Lagre" });
    await userEvent.click(lagreButton);

    expect(await screen.findByText("Begrunnelse mangler")).to.exist;
    expect(
      await screen.findByText(/Vennligst angi en gyldig dato i intervallet/)
    ).to.exist;
  });

  it("lukker modalen når skjemaet sendes inn med gyldige verdier", async () => {
    const onClose = vi.fn();
    renderDialogmoteAvventModal(onClose);

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
