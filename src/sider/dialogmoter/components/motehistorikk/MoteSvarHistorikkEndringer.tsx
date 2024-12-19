import {
  DialogmotedeltakerVarselDTO,
  DialogmoteDTO,
  MotedeltakerVarselType,
} from "@/data/dialogmote/types/dialogmoteTypes";
import { HStack, Label } from "@navikt/ds-react";
import { tilDatoMedManedNavn } from "@/utils/datoUtils";
import { ArbeidsgiverSvar } from "@/sider/dialogmoter/components/svar/ArbeidsgiverSvar";
import { ArbeidstakerSvar } from "@/sider/dialogmoter/components/svar/ArbeidstakerSvar";
import { BehandlerSvar } from "@/sider/dialogmoter/components/svar/BehandlerSvar";
import React from "react";

interface Props {
  dialogmote: DialogmoteDTO;
}

type SortableVarsel = Pick<
  DialogmotedeltakerVarselDTO,
  "varselType" | "createdAt"
>;

const getEndringVarslerSortedAsc = <T extends SortableVarsel>(varsler: T[]) =>
  varsler
    .filter(
      ({ varselType }) => varselType == MotedeltakerVarselType.NYTT_TID_STED
    )
    .sort(byCreatedAtAsc);

const byCreatedAtAsc = (v1: SortableVarsel, v2: SortableVarsel) =>
  new Date(v1.createdAt).getTime() - new Date(v2.createdAt).getTime();

export function MoteSvarHistorikkEndringer({ dialogmote }: Props) {
  const endringVarslerArbeidsgiver = getEndringVarslerSortedAsc(
    dialogmote.arbeidsgiver.varselList
  );
  const endringVarslerArbeidstaker = getEndringVarslerSortedAsc(
    dialogmote.arbeidstaker.varselList
  );
  const endringVarslerBehandler = getEndringVarslerSortedAsc(
    dialogmote.behandler?.varselList || []
  );

  return (
    <div>
      {endringVarslerArbeidsgiver.map((arbeidgiverVarsel, index) => (
        <div key={index} className="mt-4">
          <Label size="small">{`Endret tid/sted sendt ${tilDatoMedManedNavn(
            arbeidgiverVarsel.createdAt
          )} - svar:`}</Label>
          <HStack gap="4">
            <ArbeidsgiverSvar
              varsel={arbeidgiverVarsel}
              virksomhetsnummer={dialogmote.arbeidsgiver.virksomhetsnummer}
              defaultClosed
            />
            <ArbeidstakerSvar
              varsel={endringVarslerArbeidstaker[index]}
              defaultClosed
            />
            {endringVarslerBehandler[index] && (
              <BehandlerSvar
                varsel={endringVarslerBehandler[index]}
                behandlerNavn={dialogmote.behandler?.behandlerNavn || ""}
              />
            )}
          </HStack>
        </div>
      ))}
    </div>
  );
}
