import React from "react";
import {
  SkjemaFeiloppsummering,
  texts as skjemaFeilOppsummeringTexts,
} from "../../src/components/SkjemaFeiloppsummering";
import { expect } from "chai";
import { render, screen } from "@testing-library/react";

describe("SkjemaFeiloppsummering", () => {
  it("viser ikke feiloppsummering når errors er undefined", () => {
    render(<SkjemaFeiloppsummering errors={undefined} />);

    expect(screen.queryByText(skjemaFeilOppsummeringTexts.title)).to.not.exist;
  });
  it("viser ikke feiloppsummering når errors mangler feilmeldinger", () => {
    render(<SkjemaFeiloppsummering errors={{ felt: undefined }} />);

    expect(screen.queryByText(skjemaFeilOppsummeringTexts.title)).to.not.exist;
  });
  it("viser feiloppsummering for errors med feilmeldinger", () => {
    const enFeilmelding = "her er en feilmelding";
    render(<SkjemaFeiloppsummering errors={{ felt: enFeilmelding }} />);

    expect(screen.queryByText(skjemaFeilOppsummeringTexts.title)).to.exist;
    expect(screen.getByText(enFeilmelding)).to.exist;
  });
});
