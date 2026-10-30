import { formatDateWithYear } from "../datoUtils";
import { formaterOrgnr } from "@/utils";
import {
  Soknadstatus,
  SykepengesoknadDTO,
} from "@/data/sykepengesoknad/types/SykepengesoknadDTO";
import { BodyShort } from "@navikt/ds-react";

const texts = {
  korrigert: "Korrigert",
};

interface Props {
  soknad: SykepengesoknadDTO;
}

export default function SoknadStatustekst({ soknad }: Props) {
  const isSoknadSentToNav = !!soknad.sendtTilNAVDato;
  const isSoknadSentToArbeidsgiver = !!soknad.sendtTilArbeidsgiverDato;

  const arbeidsgiver = soknad.arbeidsgiver?.navn;
  const orgnr =
    soknad.arbeidsgiver?.orgnummer &&
    formaterOrgnr(soknad.arbeidsgiver.orgnummer);
  const sendtTilArbeidsgiverDato =
    soknad.sendtTilArbeidsgiverDato &&
    formatDateWithYear(soknad.sendtTilArbeidsgiverDato);
  const sendtTilNavDato =
    soknad.sendtTilNAVDato && formatDateWithYear(soknad.sendtTilNAVDato);

  if (soknad.status === Soknadstatus.KORRIGERT) {
    return <BodyShort size="small">{texts.korrigert}</BodyShort>;
  } else if (isSoknadSentToNav && isSoknadSentToArbeidsgiver) {
    return (
      <BodyShort size="small">
        Sendt til Nav og {arbeidsgiver} (org. nr. {orgnr}): {sendtTilNavDato}
      </BodyShort>
    );
  } else if (isSoknadSentToNav && !isSoknadSentToArbeidsgiver) {
    return <BodyShort size="small">Sendt til Nav: {sendtTilNavDato}</BodyShort>;
  } else {
    return (
      <BodyShort size="small">
        Sendt til {arbeidsgiver} (org. nr. {orgnr}): {sendtTilArbeidsgiverDato}
      </BodyShort>
    );
  }
}
