import React from "react";
import Side from "@/components/side/Side";
import SideLaster from "@/components/side/SideLaster";
import Sidetopp from "@/components/side/Sidetopp";
import MotehistorikkPanel from "@/sider/dialogmoter/components/motehistorikk/MotehistorikkPanel";
import DialogmoteunntakSkjema from "@/components/dialogmoteunntak/DialogmoteunntakSkjema";
import { Menypunkter } from "@/components/globalnavigasjon/GlobalNavigasjon";
import * as Tredelt from "@/components/side/TredeltSide";
import { useDialogmoterQuery } from "@/sider/dialogmoter/hooks/dialogmoteQueryHooks";
import { useGetDialogmoteunntakQuery } from "@/data/dialogmotekandidat/useGetDialogmoteunntakQuery";
import { MalformProvider } from "@/context/malform/MalformContext";
import { useGetDialogmoteIkkeAktuell } from "@/sider/dialogmoter/hooks/useGetDialogmoteIkkeAktuell";

const texts = {
  pageTitle: "Unntak fra dialogmøte",
};

export default function DialogmoteunntakSkjemaContainer() {
  const { historiskeDialogmoter } = useDialogmoterQuery();
  const { data: dialogmoteunntak } = useGetDialogmoteunntakQuery();
  const { data: dialogmoteikkeaktuell } = useGetDialogmoteIkkeAktuell();

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
              dialogmoteikkeaktuell={dialogmoteikkeaktuell}
            />
          </Tredelt.SecondColumn>
        </Tredelt.Container>
      </SideLaster>
    </Side>
  );
}
