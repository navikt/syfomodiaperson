import React from "react";
import Side from "@/components/side/Side";
import SideLaster from "@/components/side/SideLaster";
import Sidetopp from "@/components/side/Sidetopp";
import * as Tredelt from "@/components/side/TredeltSide";
import MotehistorikkPanel from "@/sider/dialogmoter/components/motehistorikk/MotehistorikkPanel";
import DialogmoteIkkeAktuellSkjema from "@/sider/dialogmoter/components/ikkeaktuell/DialogmoteIkkeAktuellSkjema";
import { Menypunkter } from "@/components/globalnavigasjon/GlobalNavigasjon";
import { useDialogmoterQuery } from "@/sider/dialogmoter/hooks/dialogmoteQueryHooks";
import { useGetDialogmoteunntakQuery } from "@/data/dialogmotekandidat/useGetDialogmoteunntakQuery";
import { MalformProvider } from "@/context/malform/MalformContext";
import { useGetDialogmoteIkkeAktuell } from "@/sider/dialogmoter/hooks/useGetDialogmoteIkkeAktuell";

const texts = {
  pageTitle: "Ikke aktuell",
};

export default function DialogmoteikkeaktuellSkjemaContainer() {
  const { historiskeDialogmoter } = useDialogmoterQuery();
  const { data: dialogmoteunntak } = useGetDialogmoteunntakQuery();
  const { data: dialogmoteikkeaktuell } = useGetDialogmoteIkkeAktuell();

  return (
    <Side tittel={texts.pageTitle} aktivtMenypunkt={Menypunkter.DIALOGMOTE}>
      <SideLaster isLoading={false} isError={false}>
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
              dialogmoteikkeaktuell={dialogmoteikkeaktuell}
            />
          </Tredelt.SecondColumn>
        </Tredelt.Container>
      </SideLaster>
    </Side>
  );
}
