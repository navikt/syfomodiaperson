import { UnntaksvurderingDTO } from "@/sider/oppfolgingsplan/hooks/types/Unntaksvurdering";
import {
  ARBEIDSTAKER_DEFAULT,
  VIRKSOMHET_PONTYPANDY,
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
  ],
};
