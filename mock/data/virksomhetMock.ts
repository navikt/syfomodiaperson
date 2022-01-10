import { VIRKSOMHET_PONTYPANDY } from "../common/mockConstants";

export const virksomhetMock = (name?: string) => {
  return {
    navn: name || VIRKSOMHET_PONTYPANDY.virksomhetsnavn,
  };
};
