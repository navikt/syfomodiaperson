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
import { DeltakereSvarInfo } from "@/sider/dialogmoter/components/DeltakereSvarInfo";
import { BodyLong, Box, Heading } from "@navikt/ds-react";
import { MoteIkonBlaaImage } from "../../../../../img/ImageComponents";
import { MalformProvider } from "@/context/malform/MalformContext";

const texts = {
  pageTitle: "Endre dialogmøte",
  pageHeader: "Endre dialogmøte",
  moteNotFound: "Fant ikke dialogmøte",
  motesvarHeading: "Møtesvar",
  motesvarSubheading: "Viser svar på siste innkalling/endring",
};

const EndreDialogmoteContainer = () => {
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
      <SideLaster henter={isLoading} hentingFeilet={isError}>
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
              <Box
                background="surface-default"
                className="flex flex-col gap-4 p-6"
              >
                <div className="flex gap-4">
                  <img src={MoteIkonBlaaImage} alt="moteikon" />
                  <div>
                    <Heading level="2" size="medium">
                      {texts.motesvarHeading}
                    </Heading>
                    <BodyLong size="small">{texts.motesvarSubheading}</BodyLong>
                  </div>
                </div>
                <DeltakereSvarInfo dialogmote={dialogmote} />
              </Box>
            </Tredelt.SecondColumn>
          </Tredelt.Container>
        ) : (
          <Feilmelding tittel={texts.moteNotFound} />
        )}
      </SideLaster>
    </Side>
  );
};

export default EndreDialogmoteContainer;
