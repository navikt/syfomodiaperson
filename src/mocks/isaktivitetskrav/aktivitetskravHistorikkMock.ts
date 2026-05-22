import { AktivitetskravStatus } from "@/data/aktivitetskrav/aktivitetskravTypes";
import { VEILEDER_DEFAULT } from "../common/mockConstants";

import { daysFromToday } from "@/utils/datoUtils.ts";

export const aktivitetskravHistorikkMock = [
  {
    tidspunkt: daysFromToday(-30),
    status: AktivitetskravStatus.NY,
    vurdertAv: null,
  },
  {
    tidspunkt: daysFromToday(-22),
    status: AktivitetskravStatus.UNNTAK,
    vurdertAv: VEILEDER_DEFAULT.ident,
  },
  {
    tidspunkt: daysFromToday(-21),
    status: AktivitetskravStatus.NY_VURDERING,
    vurdertAv: null,
  },
  {
    tidspunkt: daysFromToday(-21),
    status: AktivitetskravStatus.FORHANDSVARSEL,
    vurdertAv: VEILEDER_DEFAULT.ident,
  },
  {
    tidspunkt: daysFromToday(-1),
    status: AktivitetskravStatus.OPPFYLT,
    vurdertAv: VEILEDER_DEFAULT.ident,
  },
];
