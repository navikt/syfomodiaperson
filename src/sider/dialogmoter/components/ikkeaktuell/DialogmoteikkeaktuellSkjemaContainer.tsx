import React from "react";
import Side from "@/components/side/Side";
import SideLaster from "@/components/side/SideLaster";
import Sidetopp from "@/components/side/Sidetopp";
import * as Tredelt from "@/components/side/TredeltSide";
import { MotehistorikkPanel } from "@/sider/dialogmoter/components/motehistorikk/MotehistorikkPanel";
import DialogmoteIkkeAktuellSkjema from "@/sider/dialogmoter/components/ikkeaktuell/DialogmoteIkkeAktuellSkjema";
import { Menypunkter } from "@/components/globalnavigasjon/GlobalNavigasjon";
import { useDialogmoterQuery } from "@/sider/dialogmoter/hooks/dialogmoteQueryHooks";
import { useDialogmoteunntakQuery } from "@/data/dialogmotekandidat/dialogmoteunntakQueryHooks";
import { MalformProvider } from "@/context/malform/MalformContext";

const texts = {
  pageTitle: "Ikke aktuell",
};

const DialogmoteikkeaktuellSkjemaContainer = () => {
  const { historiskeDialogmoter } = useDialogmoterQuery();
  const { data: dialogmoteunntak } = useDialogmoteunntakQuery();

  return (
    <Side tittel={texts.pageTitle} aktivtMenypunkt={Menypunkter.DIALOGMOTE}>
      <SideLaster henter={false} hentingFeilet={false}>
        <Sidetopp tittel={texts.pageTitle} />
        <Tredelt.Container>
          <Tredelt.FirstColumn>
            <MalformProvider>
              <DialogmoteIkkeAktuellSkjema />
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
};

export default DialogmoteikkeaktuellSkjemaContainer;
