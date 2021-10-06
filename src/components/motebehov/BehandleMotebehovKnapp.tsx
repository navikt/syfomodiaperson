import React from "react";
import { useDispatch } from "react-redux";
import { Checkbox } from "nav-frontend-skjema";
import {
  erMotebehovBehandlet,
  harUbehandletMotebehov,
  hentSistBehandletMotebehov,
  motebehovlisteMedKunJaSvar,
} from "@/utils/motebehovUtils";
import { toDatePrettyPrint } from "@/utils/datoUtils";
import { behandleMotebehov } from "@/data/motebehov/behandlemotebehov_actions";
import { MotebehovVeilederDTO } from "@/data/motebehov/types/motebehovTypes";
import { useValgtPersonident } from "@/hooks/useValgtBruker";
import { useTrackOnClick } from "@/data/logging/loggingHooks";
import { useVeilederinfoQuery } from "@/data/veilederinfo/veilederinfoQueryHooks";

const texts = {
  fjernOppgave: "Jeg har vurdert behovet. Oppgaven kan fjernes fra oversikten.",
};

const behandleMotebehovKnappLabel = (
  erBehandlet: boolean,
  sistBehandletMotebehov?: MotebehovVeilederDTO
): string => {
  return erBehandlet
    ? `Ferdigbehandlet av ${
        sistBehandletMotebehov?.behandletVeilederIdent
      } ${toDatePrettyPrint(sistBehandletMotebehov?.behandletTidspunkt)}`
    : texts.fjernOppgave;
};

interface BehandleMotebehovKnappProps {
  motebehovData: MotebehovVeilederDTO[];
}

const BehandleMotebehovKnapp = ({
  motebehovData,
}: BehandleMotebehovKnappProps) => {
  const motebehovListe = motebehovlisteMedKunJaSvar(motebehovData);
  const sistBehandletMotebehov = hentSistBehandletMotebehov(motebehovListe);
  const erBehandlet = erMotebehovBehandlet(motebehovListe);
  const fnr = useValgtPersonident();
  const trackOnClick = useTrackOnClick();
  const { data: veilederinfo } = useVeilederinfoQuery();

  const dispatch = useDispatch();

  return veilederinfo && motebehovListe.length > 0 ? (
    <div className="panel behandleMotebehovKnapp">
      <div className="skjema__input">
        <Checkbox
          label={behandleMotebehovKnappLabel(
            erBehandlet,
            sistBehandletMotebehov
          )}
          onClick={() => {
            trackOnClick(texts.fjernOppgave);
            if (harUbehandletMotebehov(motebehovListe)) {
              dispatch(behandleMotebehov(fnr, veilederinfo.ident));
            }
          }}
          id="marker__utfoert"
          disabled={erBehandlet}
          defaultChecked={erBehandlet}
        />
      </div>
    </div>
  ) : (
    <></>
  );
};

export default BehandleMotebehovKnapp;
