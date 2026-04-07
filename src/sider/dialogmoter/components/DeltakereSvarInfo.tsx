import { DialogmoteDTO } from "@/sider/dialogmoter/types/dialogmoteTypes";
import React from "react";
import { ArbeidsgiverSvar } from "@/sider/dialogmoter/components/svar/ArbeidsgiverSvar";
import { ArbeidstakerSvar } from "@/sider/dialogmoter/components/svar/ArbeidstakerSvar";
import { BehandlerSvar } from "@/sider/dialogmoter/components/svar/BehandlerSvar";
import { Heading } from "@navikt/ds-react";

const texts = {
  deltakereSvaritle: "Svar fra deltakere",
};

interface Props {
  dialogmote: DialogmoteDTO;
}

export default function DeltakereSvarInfo({ dialogmote }: Props) {
  return (
    <div>
      <Heading level="3" size="small">
        {texts.deltakereSvaritle}
      </Heading>
      <div className="flex flex-col w-full gap-4">
        <ArbeidsgiverSvar
          varsel={dialogmote.arbeidsgiver.varselList[0]}
          virksomhetsnummer={dialogmote.arbeidsgiver.virksomhetsnummer}
        />
        <ArbeidstakerSvar varsel={dialogmote.arbeidstaker.varselList[0]} />
        {dialogmote.behandler && (
          <BehandlerSvar
            varsel={dialogmote.behandler.varselList[0]}
            behandlerNavn={dialogmote.behandler.behandlerNavn}
          />
        )}
      </div>
    </div>
  );
}
