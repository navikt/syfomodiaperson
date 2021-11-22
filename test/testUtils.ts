import { ReactWrapper } from "enzyme";
import { expect } from "chai";

export const changeTextAreaValue = (
  wrapper: ReactWrapper<any, any>,
  textAreaName: string,
  value: string
) => {
  const textArea = wrapper
    .find("textarea")
    .findWhere((w) => w.prop("name") === textAreaName);
  changeFieldValue(textArea, value);
};

export const changeFieldValue = (
  field: ReactWrapper<any, any>,
  newValue: string
) => {
  field.simulate("change", {
    target: {
      value: newValue,
    },
  });
};

export const assertFeilmelding = (
  feilmeldinger: ReactWrapper<any, any>,
  msg: string
) => expect(feilmeldinger.someWhere((feil) => feil.text() === msg)).to.be.true;

export const maxLengthErrorMessage = (max: number) =>
  `Maks ${max} tegn tillatt`;
export const getTooLongText = (max: number) => "t".repeat(max + 1);
