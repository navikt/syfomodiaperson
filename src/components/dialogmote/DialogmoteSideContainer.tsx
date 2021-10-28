import React, { ReactElement } from "react";
import { useParams } from "react-router-dom";
import Side from "../../sider/Side";
import { MOETEPLANLEGGER } from "@/enums/menypunkter";
import SideLaster from "../SideLaster";
import Sidetopp from "../Sidetopp";
import Feilmelding from "../Feilmelding";
import { DialogmoteDTO } from "@/data/dialogmote/types/dialogmoteTypes";
import { BrukerKanIkkeVarslesPapirpostAdvarsel } from "@/components/dialogmote/BrukerKanIkkeVarslesPapirpostAdvarsel";
import { useDM2FeatureToggles } from "@/data/unleash/unleash_hooks";
import { useNavBrukerData } from "@/data/navbruker/navbruker_hooks";
import { useDialogmoterQuery } from "@/data/dialogmote/dialogmoteQueryHooks";
import { useValgtPersonident } from "@/hooks/useValgtBruker";

interface DialogmoteSideProps {
  title: string;
  header: string;
  children: (dialogmote: DialogmoteDTO) => ReactElement;
}

const texts = {
  moteNotFound: "Fant ikke dialogmøte",
};

export const DialogmoteSideContainer = ({
  title,
  header,
  children,
}: DialogmoteSideProps): ReactElement => {
  const { dialogmoteUuid } = useParams<{
    dialogmoteUuid: string;
  }>();
  const fnr = useValgtPersonident();
  const { isLoading, isError, data: dialogmoter } = useDialogmoterQuery();
  const { isDm2FysiskBrevEnabled } = useDM2FeatureToggles();
  const { brukerKanIkkeVarslesDigitalt } = useNavBrukerData();

  const dialogmote = dialogmoter?.find(
    (dialogmote) => dialogmote.uuid === dialogmoteUuid
  );

  return (
    <Side fnr={fnr} tittel={title} aktivtMenypunkt={MOETEPLANLEGGER}>
      <SideLaster henter={isLoading} hentingFeilet={isError}>
        <Sidetopp tittel={header} />
        {isDm2FysiskBrevEnabled && brukerKanIkkeVarslesDigitalt && (
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
};
