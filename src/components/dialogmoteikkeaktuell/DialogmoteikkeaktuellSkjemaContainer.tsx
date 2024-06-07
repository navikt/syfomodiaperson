import React from "react";
import Side from "@/sider/Side";
import SideLaster from "@/components/SideLaster";
import Sidetopp from "@/components/Sidetopp";
import DialogmoteikkeaktuellSkjema from "@/components/dialogmoteikkeaktuell/DialogmoteikkeaktuellSkjema";
import { Menypunkter } from "@/components/globalnavigasjon/GlobalNavigasjon";

const texts = {
  pageTitle: "Ikke aktuell",
};

const DialogmoteikkeaktuellSkjemaContainer = () => {
  return (
    <Side tittel={texts.pageTitle} aktivtMenypunkt={Menypunkter.DIALOGMOTE}>
      <SideLaster henter={false} hentingFeilet={false}>
        <Sidetopp tittel={texts.pageTitle} />
        <DialogmoteikkeaktuellSkjema />
      </SideLaster>
    </Side>
  );
};

export default DialogmoteikkeaktuellSkjemaContainer;
