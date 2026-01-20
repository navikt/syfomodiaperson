import React, { ReactElement } from "react";
import OppsummeringPerioder from "./OppsummeringPerioder";
import OppsummeringDato from "./OppsummeringDato";
import OppsummeringTall from "./OppsummeringTall";
import OppsummeringCheckbox from "./OppsummeringCheckbox";
import OppsummeringJaEllerNei from "./OppsummeringJaEllerNei";
import OppsummeringFritekst from "./OppsummeringFritekst";
import { OppsummeringUndertekst } from "./OppsummeringUndertekst";
import OppsummeringRadioGruppe from "./OppsummeringRadioGruppe";
import OppsummeringGruppeRadioUkekalender from "./OppsummeringGruppeRadioUkekalender";
import {
  SporsmalDTO,
  SvarTypeDTO,
} from "@/data/sykepengesoknad/types/SykepengesoknadDTO";
import OppsummeringKvittering from "@/sider/sykepengsoknader/soknad-felles-oppsummering/OppsummeringKvittering";
import OppsummeringSporsmalstekst from "@/sider/sykepengsoknader/soknad-felles-oppsummering/OppsummeringSporsmalstekst";
import OppsummeringUndersporsmalsliste from "@/sider/sykepengsoknader/soknad-felles-oppsummering/OppsummeringUndersporsmalsliste";
import { getKey } from "@/sider/sykepengsoknader/soknad-felles-oppsummering/Oppsummeringsvisning";
import OppsummeringSporsmalscontainer from "@/sider/sykepengsoknader/soknad-felles-oppsummering/OppsummeringSporsmalscontainer";

export interface OppsummeringSporsmalProps extends SporsmalDTO {
  overskriftsnivaa?: number;
}

export default function OppsummeringSporsmal(
  props: OppsummeringSporsmalProps
): ReactElement | null {
  switch (props.svartype) {
    case SvarTypeDTO.CHECKBOX_PANEL:
    case SvarTypeDTO.CHECKBOX: {
      return <OppsummeringCheckbox {...props} />;
    }
    case SvarTypeDTO.JA_NEI: {
      return <OppsummeringJaEllerNei {...props} />;
    }
    case SvarTypeDTO.DATO:
    case SvarTypeDTO.DATOER: {
      return <OppsummeringDato {...props} />;
    }
    case SvarTypeDTO.PERIODE:
    case SvarTypeDTO.PERIODER: {
      return <OppsummeringPerioder {...props} />;
    }
    case SvarTypeDTO.COMBOBOX_SINGLE:
    case SvarTypeDTO.COMBOBOX_MULTI:
    case SvarTypeDTO.LAND:
    case SvarTypeDTO.FRITEKST: {
      return <OppsummeringFritekst {...props} />;
    }
    case SvarTypeDTO.IKKE_RELEVANT:
    case SvarTypeDTO.GRUPPE_AV_UNDERSPORSMAL:
    case SvarTypeDTO.INFO_BEHANDLINGSDAGER: {
      return <OppsummeringUndertekst {...props} />;
    }
    case SvarTypeDTO.CHECKBOX_GRUPPE: {
      return (
        <OppsummeringSporsmalscontainer tag={props.tag}>
          <OppsummeringSporsmalstekst overskriftsnivaa={props.overskriftsnivaa}>
            {props.sporsmalstekst}
          </OppsummeringSporsmalstekst>
          {props.undersporsmal.map((s) => (
            <OppsummeringSporsmal
              {...s}
              overskriftsnivaa={
                props.overskriftsnivaa && props.overskriftsnivaa + 1
              }
              key={getKey(s.tag, s.id)}
            />
          ))}
        </OppsummeringSporsmalscontainer>
      );
    }
    case SvarTypeDTO.TALL:
    case SvarTypeDTO.PROSENT:
    case SvarTypeDTO.TIMER:
    case SvarTypeDTO.BELOP:
    case SvarTypeDTO.KILOMETER: {
      return <OppsummeringTall {...props} />;
    }
    case SvarTypeDTO.RADIO_GRUPPE_TIMER_PROSENT:
    case SvarTypeDTO.RADIO_GRUPPE: {
      return <OppsummeringRadioGruppe {...props} />;
    }
    case SvarTypeDTO.RADIO_GRUPPE_UKEKALENDER:
      return <OppsummeringGruppeRadioUkekalender {...props} />;
    case SvarTypeDTO.KVITTERING: {
      return <OppsummeringKvittering {...props} />;
    }
    case SvarTypeDTO.BEKREFTELSESPUNKTER: {
      return (
        <div className="oppsummering__VisUndertekst" id={props.id}>
          <OppsummeringSporsmalstekst overskriftsnivaa={props.overskriftsnivaa}>
            {props.sporsmalstekst}
          </OppsummeringSporsmalstekst>
          <ul>
            {props.svar.map((s, index) => (
              <li key={index} className="redaksjonelt-innhold">
                {s.verdi}
              </li>
            ))}
          </ul>
          {props.undersporsmal.length > 0 && (
            <OppsummeringUndersporsmalsliste
              sporsmalsliste={props.undersporsmal}
              overskriftsnivaa={props.overskriftsnivaa}
            />
          )}
        </div>
      );
    }
    case SvarTypeDTO.OPPSUMMERING:
      return null;
    default: {
      return null;
    }
  }
}
