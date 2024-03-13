import React from "react";
import { useArbeidsuforhetVurderingQuery } from "@/data/arbeidsuforhet/arbeidsuforhetQueryHooks";
import { ForhandsvarselBeforeDeadline } from "@/sider/arbeidsuforhet/ForhandsvarselBeforeDeadline";
import { ForhandsvarselAfterDeadline } from "@/sider/arbeidsuforhet/ForhandsvarseAfterDeadline";
import { Box } from "@navikt/ds-react";
import dayjs from "dayjs";
import { VurderArbeidsuforhetTabs } from "@/sider/arbeidsuforhet/VurderArbeidsuforhetTabs";

export const ForhandsvarselSendt = () => {
  const { data } = useArbeidsuforhetVurderingQuery();
  const forhandsvarsel = data[0];
  const frist = forhandsvarsel.varsel?.svarfrist;
  const isBeforeFrist = dayjs().isBefore(frist, "day");

  return (
    <div>
      {isBeforeFrist ? (
        <ForhandsvarselBeforeDeadline />
      ) : (
        <ForhandsvarselAfterDeadline />
      )}
      <Box background="surface-default" padding="3" className="mb-2">
        <VurderArbeidsuforhetTabs />
      </Box>
    </div>
  );
};
