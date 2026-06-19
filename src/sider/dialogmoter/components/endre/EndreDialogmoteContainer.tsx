import React from "react";
import EndreDialogmoteSkjema from "./EndreDialogmoteSkjema";
import { useParams } from "react-router-dom";
import { useDialogmoterQuery } from "@/sider/dialogmoter/hooks/dialogmoteQueryHooks";
import { useKontaktinfoQuery } from "@/data/navbruker/navbrukerQueryHooks";
import Side from "@/components/side/Side";
import { Menypunkter } from "@/components/globalnavigasjon/GlobalNavigasjon";
import SideLaster from "@/components/side/SideLaster";
import Sidetopp from "@/components/side/Sidetopp";
import { BrukerKanIkkeVarslesPapirpostAdvarsel } from "@/sider/dialogmoter/components/BrukerKanIkkeVarslesPapirpostAdvarsel";
import Feilmelding from "@/components/Feilmelding";
import * as Tredelt from "@/components/side/TredeltSide";
import { MalformProvider } from "@/context/malform/MalformContext";
import { MoteSvarHistorikkSingle } from "@/sider/dialogmoter/components/motehistorikk/MoteSvarHistorikkSingle.tsx";

const texts = {
  pageTitle: "Endre dialogmøte",
  pageHeader: "Endre dialogmøte",
  moteNotFound: "Fant ikke dialogmøte",
};

export default function EndreDialogmoteContainer() {
  const { dialogmoteUuid } = useParams<{
    dialogmoteUuid: string;
  }>();
  const { isLoading, isError, data: dialogmoter } = useDialogmoterQuery();
  const { brukerKanIkkeVarslesDigitalt } = useKontaktinfoQuery();

  const dialogmote = dialogmoter.find(
    (dialogmote) => dialogmote.uuid === dialogmoteUuid
  );

  return (
    <Side tittel={texts.pageTitle} aktivtMenypunkt={Menypunkter.DIALOGMOTE}>
      <SideLaster isLoading={isLoading} isError={isError}>
        <Sidetopp tittel={texts.pageHeader} />
        {dialogmote ? (
          <Tredelt.Container>
            <Tredelt.FirstColumn>
              {brukerKanIkkeVarslesDigitalt && (
                <BrukerKanIkkeVarslesPapirpostAdvarsel />
              )}
              <MalformProvider>
                <EndreDialogmoteSkjema dialogmote={dialogmote} />
              </MalformProvider>
            </Tredelt.FirstColumn>
            <Tredelt.SecondColumn>
              <MoteSvarHistorikkSingle dialogmote={dialogmote} />
            </Tredelt.SecondColumn>
          </Tredelt.Container>
        ) : (
          <Feilmelding tittel={texts.moteNotFound} />
        )}
      </SideLaster>
    </Side>
  );
}
