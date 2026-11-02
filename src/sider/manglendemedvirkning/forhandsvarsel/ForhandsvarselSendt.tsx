import { VurderingResponseDTO } from "@/data/manglendemedvirkning/manglendeMedvirkningTypes";

import ForhandsvarselBeforeDeadline from "@/sider/manglendemedvirkning/forhandsvarsel/ForhandsvarselBeforeDeadline";
import ForhandsvarselAfterDeadline from "@/sider/manglendemedvirkning/forhandsvarsel/ForhandsvarselAfterDeadline";
import { isExpired } from "@/utils/datoUtils";

interface Props {
  forhandsvarsel: VurderingResponseDTO;
}

export default function ForhandsvarselSendt({ forhandsvarsel }: Props) {
  const isForhandsvarselExpired = isExpired(forhandsvarsel.varsel?.svarfrist);

  return isForhandsvarselExpired ? (
    <ForhandsvarselAfterDeadline forhandsvarsel={forhandsvarsel} />
  ) : (
    <ForhandsvarselBeforeDeadline forhandsvarsel={forhandsvarsel} />
  );
}
