import React, { ReactElement } from "react";
import OppsummeringSporsmalscontainer from "./OppsummeringSporsmalscontainer";
import OppsummeringSporsmalstekst from "@/sider/sykepengsoknader/soknad-felles-oppsummering/OppsummeringSporsmalstekst";
import OppsummeringUndersporsmalsliste from "./OppsummeringUndersporsmalsliste";
import {
  SporsmalDTO,
  SvarDTO,
  VisningskriterieDTO,
} from "@/data/sykepengesoknad/types/SykepengesoknadDTO";
import {
  BodyShort,
  Checkbox,
  Detail,
  Radio,
  RadioGroup,
} from "@navikt/ds-react";
import {
  CheckmarkCircleIcon,
  CheckmarkHeavyIcon,
  CheckmarkIcon,
  CircleIcon,
  CircleSlashIcon,
  XMarkIcon,
} from "@navikt/aksel-icons";

const texts = {
  ja: "Ja",
  nei: "Nei",
};

const getLedetekstFraSvar = (svar: string) => {
  return svar.toLowerCase() === "ja" ? texts.ja : texts.nei;
};

const getLedetekstFraSvar2 = (svar: string) => {
  return svar.toLowerCase() === "ja";
};

const erUndersporsmalStilt = (
  svar: SvarDTO[],
  kriterieForVisningAvUndersporsmal?: VisningskriterieDTO,
) => svar.some((s) => s.verdi === kriterieForVisningAvUndersporsmal);

export function OppsummeringJaEllerNei({
  svar,
  sporsmalstekst,
  kriterieForVisningAvUndersporsmal,
  undersporsmal,
}: SporsmalDTO): ReactElement | null {
  if (svar[0] === undefined) {
    return null;
  }
  return (
    <OppsummeringSporsmalscontainer>
      <OppsummeringSporsmalstekst>{sporsmalstekst}</OppsummeringSporsmalstekst>
      {/* <RadioGroup legend="" hideLegend defaultValue={svar[0].verdi}>
        <Radio size="small" readOnly value={svar[0].verdi}> */}
      <div>
        {getLedetekstFraSvar2(svar[0].verdi as string) ? (
          <BodyShort textColor="default">
            <CheckmarkCircleIcon
              title="a11y-title"
              fontSize="1.2rem"
              className="inline mr-1 relative -top-px"
              color="var(--ax-text-success-decoration)"
            />
            Ja
          </BodyShort>
        ) : (
          <BodyShort>
            <CircleSlashIcon
              title="a11y-title"
              fontSize="1.2rem"
              className="inline mr-1 relative -top-0.5"
              color="var(--ax-text-brand-beige-decoration)"
            />
            Nei
          </BodyShort>
        )}
      </div>
      {/* </Radio>
      </RadioGroup> */}
      {erUndersporsmalStilt(svar, kriterieForVisningAvUndersporsmal) &&
        undersporsmal.length > 0 && (
          <OppsummeringUndersporsmalsliste sporsmalsliste={undersporsmal} />
        )}
    </OppsummeringSporsmalscontainer>
  );
}
