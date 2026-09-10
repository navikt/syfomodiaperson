import { UnntaksvurderingDTO } from "@/sider/oppfolgingsplan/hooks/types/Unntaksvurdering";
import {
  ARBEIDSTAKER_DEFAULT,
  VIRKSOMHET_PONTYPANDY,
  VIRKSOMHET_BRANNOGBIL,
} from "../common/mockConstants";
import { addWeeks } from "@/utils/datoUtils";

export const unntaksvurderingerMock: UnntaksvurderingDTO = {
  unntaksvurderinger: [
    {
      uuid: "3abbad77-1206-4432-b2f5-953566e5e9a1",
      fnr: ARBEIDSTAKER_DEFAULT.personIdent,
      organisasjonsnavn: VIRKSOMHET_PONTYPANDY.virksomhetsnavn,
      organisasjonsnummer: VIRKSOMHET_PONTYPANDY.virksomhetsnummer,
      meldtTidspunkt: addWeeks(new Date(), -30).toISOString(),
    },
    {
      uuid: "b4da6fc4-0dde-40a5-9519-d8aac08f6cf8",
      fnr: ARBEIDSTAKER_DEFAULT.personIdent,
      organisasjonsnavn: VIRKSOMHET_BRANNOGBIL.virksomhetsnavn,
      organisasjonsnummer: VIRKSOMHET_BRANNOGBIL.virksomhetsnummer,
      meldtTidspunkt: addWeeks(new Date(), -30).toISOString(),
    },
  ],
};
