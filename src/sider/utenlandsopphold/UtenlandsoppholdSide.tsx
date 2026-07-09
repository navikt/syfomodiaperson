import React from "react";
import Side from "@/components/side/Side";
import Sidetopp from "@/components/side/Sidetopp";
import SideLaster from "@/components/side/SideLaster";
import * as Tredelt from "@/components/side/TredeltSide";
import { Menypunkter } from "@/components/globalnavigasjon/GlobalNavigasjon";
import { NotificationProvider } from "@/context/notification/NotificationContext";
import { UtenlandsoppholdSoknader } from "@/sider/utenlandsopphold/UtenlandsoppholdSoknader.tsx";
import { UtenlandsoppholdSoknad } from "@/sider/utenlandsopphold/UtenlandsoppholdSoknad.tsx";

const texts = {
  title: "Søknad om sykepenger under opphold utenfor EØS",
};

interface Props {
  children:
    | React.ReactElement<typeof UtenlandsoppholdSoknader>
    | React.ReactElement<typeof UtenlandsoppholdSoknad>;
}

export function UtenlandsoppholdSide({ children }: Props) {
  return (
    <Side tittel={texts.title} aktivtMenypunkt={Menypunkter.UTENLANDSOPPHOLD}>
      <Sidetopp tittel={texts.title} />
      <SideLaster isLoading={false} isError={false}>
        <Tredelt.Container>
          <Tredelt.FirstColumn className="-xl:mb-2">
            <NotificationProvider>{children}</NotificationProvider>
          </Tredelt.FirstColumn>
        </Tredelt.Container>
      </SideLaster>
    </Side>
  );
}
