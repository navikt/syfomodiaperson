import React from "react";
import Side from "@/components/side/Side";
import SideLaster from "@/components/side/SideLaster";
import Sidetopp from "@/components/side/Sidetopp";
import MotehistorikkPanel from "@/sider/dialogmoter/components/motehistorikk/MotehistorikkPanel";
import DialogmoteunntakSkjema from "@/components/dialogmoteunntak/DialogmoteunntakSkjema";
import { Menypunkter } from "@/components/globalnavigasjon/GlobalNavigasjon";
import * as Tredelt from "@/components/side/TredeltSide";
import { useDialogmoterQuery } from "@/sider/dialogmoter/hooks/dialogmoteQueryHooks";
import { useDialogmoteunntakQuery } from "@/data/dialogmotekandidat/dialogmoteunntakQueryHooks";
import { MalformProvider } from "@/context/malform/MalformContext";

const texts = {
  pageTitle: "Unntak fra dialogmøte",
};

export default function DialogmoteunntakSkjemaContainer() {
  const { historiskeDialogmoter } = useDialogmoterQuery();
  const { data: dialogmoteunntak } = useDialogmoteunntakQuery();

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
            <MotehistorikkPanel
              historiskeMoter={historiskeDialogmoter}
              dialogmoteunntak={dialogmoteunntak}
            />
          </Tredelt.SecondColumn>
        </Tredelt.Container>
      </SideLaster>
    </Side>
  );
}
