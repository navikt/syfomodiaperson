import { HStack, Label } from "@navikt/ds-react";
import { tilDatoMedManedNavn } from "@/utils/datoUtils";
import { ArbeidsgiverSvar } from "@/sider/dialogmoter/components/svar/ArbeidsgiverSvar";
import { ArbeidstakerSvar } from "@/sider/dialogmoter/components/svar/ArbeidstakerSvar";
import { BehandlerSvar } from "@/sider/dialogmoter/components/svar/BehandlerSvar";
import React from "react";
import {
  DialogmoteDTO,
  MotedeltakerVarselType,
} from "@/sider/dialogmoter/types/dialogmoteTypes";

interface Props {
  dialogmote: DialogmoteDTO;
}

export function MoteSvarHistorikkInnkalling({ dialogmote }: Props) {
  const innkallingArbeidstaker = dialogmote.arbeidstaker.varselList.find(
    ({ varselType }) => varselType === MotedeltakerVarselType.INNKALT
  );
  const innkallingArbeidsgiver = dialogmote.arbeidsgiver.varselList.find(
    ({ varselType }) => varselType === MotedeltakerVarselType.INNKALT
  );
  const innkallingBehandler =
    dialogmote.behandler &&
    dialogmote.behandler.varselList.find(
      ({ varselType }) => varselType === MotedeltakerVarselType.INNKALT
    );

  return (
    <div>
      <Label size="small">{`Innkalling sendt ${tilDatoMedManedNavn(
        dialogmote.createdAt
      )} - svar:`}</Label>
      <HStack gap="4">
        {innkallingArbeidsgiver && (
          <ArbeidsgiverSvar
            varsel={innkallingArbeidsgiver}
            virksomhetsnummer={dialogmote.arbeidsgiver.virksomhetsnummer}
            defaultClosed
          />
        )}
        {innkallingArbeidstaker && (
          <ArbeidstakerSvar varsel={innkallingArbeidstaker} defaultClosed />
        )}
        {innkallingBehandler && (
          <BehandlerSvar
            varsel={innkallingBehandler}
            behandlerNavn={dialogmote.behandler.behandlerNavn}
          />
        )}
      </HStack>
    </div>
  );
}
