import { expect } from "chai";
import React from "react";
import { Form } from "react-final-form";
import Datovelger, { validerDatoField } from "../../src/components/Datovelger";
import { render } from "@testing-library/react";

describe("Datovelger", () => {
  let component;

  describe("Datovelger", () => {
    beforeEach(() => {
      component = render(
        <Form
          onSubmit={() => {
            /* Do nothing */
          }}
        >
          {() => <Datovelger name="halla" id="id" />}
        </Form>
      );
    });

    it("Skal inneholde input-felt og kalender", () => {
      expect(
        component.getByRole("textbox", { selector: ".nav-datovelger__input" })
      ).to.exist;
      expect(component.getByRole("button", { name: "Kalender" })).to.exist;
    });
  });

  describe("validerDatoField", () => {
    it("Skal returnere Vennligst angi dato hvis dato ikke er sendt inn", () => {
      const res = validerDatoField(undefined, undefined);
      expect(res).to.be.equal("Vennligst angi dato");
    });

    it("Skal returnere Datoen er ikke gyldig eller har ikke riktig format hvis dato er på feil format", () => {
      const s =
        "Datoen er ikke gyldig eller har ikke riktig format (dd.mm.åååå)";
      const res = validerDatoField("olsen", undefined);
      const res2 = validerDatoField("200-02-22", undefined);
      expect(res).to.equal(s);
      expect(res2).to.equal(s);
    });

    it("Skal ikke klage hvis datoen er samme dato som fra", () => {
      const res = validerDatoField("2018-12-01", new Date("2018-12-01"));
      expect(res).to.be.equal(undefined);
    });

    it("Skal ikke klage hvis datoen er etter fra", () => {
      const res = validerDatoField("2018-12-02", new Date("2018-12-01"));
      expect(res).to.be.equal(undefined);
    });
  });
});
