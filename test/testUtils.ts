import userEvent from "@testing-library/user-event";
import { fireEvent, screen } from "@testing-library/react";

export const clickButton = (buttonText: string) =>
  userEvent.click(screen.getByRole("button", { name: buttonText }));

export const getFeilmeldingLink = (feilmelding: string) =>
  screen.queryByRole("link", {
    name: feilmelding,
  });

export const getTextInput = (name: string) =>
  screen.getByRole("textbox", {
    name,
  });

export const changeTextInput = (input: HTMLElement, value: string) =>
  fireEvent.change(input, {
    target: { value },
  });

export const maxLengthErrorMessage = (max: number) =>
  `Maks ${max} tegn tillatt`;

export const getTooLongText = (max: number) => "t".repeat(max + 1);
