import React from "react";
import Side from "@/sider/Side";
import SideLaster from "@/components/SideLaster";
import Sidetopp from "@/components/Sidetopp";
import { MotehistorikkPanel } from "@/sider/dialogmoter/components/motehistorikk/MotehistorikkPanel";
import DialogmoteunntakSkjema from "@/components/dialogmoteunntak/DialogmoteunntakSkjema";
import { Menypunkter } from "@/components/globalnavigasjon/GlobalNavigasjon";
import * as Tredelt from "@/sider/TredeltSide";
import { MalformProvider } from "@/context/malform/MalformContext";

const texts = {
  pageTitle: "Unntak fra dialogmøte",
};

const DialogmoteunntakSkjemaContainer = () => {
  return (
    <Side tittel={texts.pageTitle} aktivtMenypunkt={Menypunkter.DIALOGMOTE}>
      <SideLaster henter={false} hentingFeilet={false}>
        <Sidetopp tittel={texts.pageTitle} />
        <Tredelt.Container>
          <Tredelt.FirstColumn>
            <MalformProvider>
              <DialogmoteunntakSkjema />
            </MalformProvider>
          </Tredelt.FirstColumn>
          <Tredelt.SecondColumn>
            <MotehistorikkPanel />
          </Tredelt.SecondColumn>
        </Tredelt.Container>
      </SideLaster>
    </Side>
  );
};

export default DialogmoteunntakSkjemaContainer;
