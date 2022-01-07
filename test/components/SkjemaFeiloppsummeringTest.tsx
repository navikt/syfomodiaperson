import React from "react";
import {
  SkjemaFeiloppsummering,
  texts as skjemaFeilOppsummeringTexts,
} from "../../src/components/SkjemaFeiloppsummering";
import { expect } from "chai";
import { render } from "@testing-library/react";

describe("SkjemaFeiloppsummering", () => {
  it("viser ikke feiloppsummering når errors er undefined", () => {
    const wrapper = render(<SkjemaFeiloppsummering errors={undefined} />);
    expect(wrapper.queryByText(skjemaFeilOppsummeringTexts.title)).to.not.exist;
  });
  it("viser ikke feiloppsummering når errors mangler feilmeldinger", () => {
    const wrapper = render(
      <SkjemaFeiloppsummering errors={{ felt: undefined }} />
    );
    expect(wrapper.queryByText(skjemaFeilOppsummeringTexts.title)).to.not.exist;
  });
  it("viser feiloppsummering for errors med feilmeldinger", () => {
    const enFeilmelding = "her er en feilmelding";
    const wrapper = render(
      <SkjemaFeiloppsummering errors={{ felt: enFeilmelding }} />
    );
    expect(wrapper.queryByText(skjemaFeilOppsummeringTexts.title)).to.exist;
    expect(wrapper.getByText(enFeilmelding)).to.exist;
  });
});
