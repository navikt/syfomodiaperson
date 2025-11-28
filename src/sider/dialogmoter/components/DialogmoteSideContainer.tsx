import React, { ReactElement } from "react";
import { useParams } from "react-router-dom";
import { DialogmoteDTO } from "@/sider/dialogmoter/types/dialogmoteTypes";
import { BrukerKanIkkeVarslesPapirpostAdvarsel } from "@/sider/dialogmoter/components/BrukerKanIkkeVarslesPapirpostAdvarsel";
import { useDialogmoterQuery } from "@/sider/dialogmoter/hooks/dialogmoteQueryHooks";
import { useKontaktinfoQuery } from "@/data/navbruker/navbrukerQueryHooks";
import { Menypunkter } from "@/components/globalnavigasjon/GlobalNavigasjon";
import Side from "@/components/side/Side";
import SideLaster from "@/components/side/SideLaster";
import Sidetopp from "@/components/side/Sidetopp";
import Feilmelding from "@/components/Feilmelding";

interface DialogmoteSideProps {
  title: string;
  header: string;
  children: (dialogmote: DialogmoteDTO) => ReactElement;
}

const texts = {
  moteNotFound: "Fant ikke dialogmøte",
};

export default function DialogmoteSideContainer({
  title,
  header,
  children,
}: DialogmoteSideProps): ReactElement {
  const { dialogmoteUuid } = useParams<{
    dialogmoteUuid: string;
  }>();
  const { isLoading, isError, data: dialogmoter } = useDialogmoterQuery();
  const { brukerKanIkkeVarslesDigitalt } = useKontaktinfoQuery();

  const dialogmote = dialogmoter.find(
    (dialogmote) => dialogmote.uuid === dialogmoteUuid
  );

  return (
    <Side tittel={title} aktivtMenypunkt={Menypunkter.DIALOGMOTE}>
      <SideLaster henter={isLoading} hentingFeilet={isError}>
        <Sidetopp tittel={header} />
        {brukerKanIkkeVarslesDigitalt && (
          <BrukerKanIkkeVarslesPapirpostAdvarsel />
        )}
        {dialogmote ? (
          children(dialogmote)
        ) : (
          <Feilmelding tittel={texts.moteNotFound} />
        )}
      </SideLaster>
    </Side>
  );
}
