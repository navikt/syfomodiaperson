import { UtropstegnImage } from "../../../../img/ImageComponents";
import MotebehovKvittering from "./MotebehovKvittering";
import BehandleMotebehovKnapp from "../../../components/motebehov/BehandleMotebehovKnapp";
import { DialogmotePanel } from "@/sider/dialogmoter/components/DialogmotePanel";
import React from "react";
import { BodyLong, Box, Heading, HStack } from "@navikt/ds-react";
import { LanguageIcon } from "@navikt/aksel-icons";
import { EksternLenke } from "@/components/EksternLenke";

const texts = {
  onskerOmDialogmote: "Behov for dialogmøte",
};

export const DialogmoteOnskePanel = () => {
  const visInfoOmTolk = true;
  return (
    <>
      <DialogmotePanel icon={UtropstegnImage} header={texts.onskerOmDialogmote}>
        <MotebehovKvittering />
        <BehandleMotebehovKnapp />
      </DialogmotePanel>
      {visInfoOmTolk && (
        <Box
          background="surface-default"
          className="flex flex-col mb-4 p-6 gap-6"
        >
          <Heading size={"medium"} level={"2"}>
            <HStack>
              Det er meldt inn behov for tolk
              <LanguageIcon fontSize={"2rem"} />
            </HStack>
            <BodyLong>
              Det har blitt meldt inn et behov for tolk for dialogmøte, og det
              er ikke registrert tolk på den sykmeldte tidligere.
              <EksternLenke
                href={
                  "https://tjenester.nav.no/sykefravaer/sykepengesoknad-utland"
                }
              >
                Ønsker du å registrere behov for tolk på vedkommende, klikk her.
              </EksternLenke>
            </BodyLong>
          </Heading>
        </Box>
      )}
    </>
  );
};
