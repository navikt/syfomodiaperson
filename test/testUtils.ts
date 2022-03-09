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

export const getCheckbox = (name: string, checked: boolean) =>
  screen.getByRole("checkbox", {
    checked,
    name,
  });

export const maxLengthErrorMessage = (max: number) =>
  `Maks ${max} tegn tillatt`;

export const getTooLongText = (max: number) => "t".repeat(max + 1);

export const daysFromToday = (days: number): Date => {
  const nyDato = new Date();
  nyDato.setDate(nyDato.getDate() + days);
  return new Date(nyDato);
};
