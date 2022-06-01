import React, { ReactElement, useState } from "react";
import dayjs from "dayjs";
import { Knapp } from "nav-frontend-knapper";
import {
  tilLesbarDatoMedArstall,
  tilLesbarPeriodeMedArstall,
} from "@/utils/datoUtils";
import Lightbox from "../../../Lightbox";
import { SoknaderImage } from "../../../../../img/ImageComponents";
import {
  SoknadstatusDTO,
  SykepengesoknadDTO,
} from "@/data/sykepengesoknad/types/SykepengesoknadDTO";

const texts = {
  dato: {
    tittel: "Planlagt søknad",
    info: "Du kan fylle ut denne søknaden",
    fremtidig: "Kan fylles ut fra",
  },
  status: {
    fremtidig: "Planlagt",
    sender: "Sender...",
    utkastTilKorrigering: "Utkast til endring",
  },
  tittel: "Søknad om sykepenger",
  teaserTekst: "Gjelder perioden",
};

const textDatoInfo = (dato?: string) => {
  return `${texts.dato.info} ${dato}`;
};

const textDatoFremtidig = (dato?: string) => {
  return `${texts.dato.fremtidig} ${dato}`;
};

const textSoknadStatus = (status: SoknadstatusDTO) => {
  switch (status) {
    case SoknadstatusDTO.FREMTIDIG:
      return texts.status.fremtidig;
    case SoknadstatusDTO.TIL_SENDING:
      return texts.status.sender;
    case SoknadstatusDTO.UTKAST_TIL_KORRIGERING:
      return texts.status.utkastTilKorrigering;
    default:
      return "";
  }
};

const textTeaserText = (periode: string) => {
  return `${texts.teaserTekst} ${periode}`;
};

interface SoknadLightboxProps {
  soknad: SykepengesoknadDTO;

  onClose(): void;
}

const SoknadLightbox = ({ soknad, onClose }: SoknadLightboxProps) => (
  <Lightbox onClose={onClose}>
    <h3 className="panel__tittel">{texts.dato.tittel}</h3>
    <p>
      {textDatoInfo(
        tilLesbarDatoMedArstall(dayjs(soknad.tom).add(1, "days").toDate())
      )}
    </p>
    <div className="knapperad">
      <Knapp onClick={onClose}>Lukk</Knapp>
    </div>
  </Lightbox>
);

interface FremtidigSoknadTeaserProps {
  soknad: SykepengesoknadDTO;
}

const FremtidigSoknadTeaser = ({
  soknad,
}: FremtidigSoknadTeaserProps): ReactElement => {
  const [vis, setVis] = useState(false);

  return (
    <article aria-labelledby={`soknader-header-${soknad.id}`}>
      <button
        className="inngangspanel inngangspanel--inaktivt"
        onClick={(e) => {
          e.preventDefault();
          setVis(true);
        }}
      >
        <span className="inngangspanel__ikon">
          <img alt="" className="js-ikon" src={SoknaderImage} />
        </span>
        <div className="inngangspanel__innhold">
          <header className="inngangspanel__header">
            <h3 className="js-title" id={`soknad-header-${soknad.id}`}>
              <small className="inngangspanel__meta js-meta">
                {textDatoFremtidig(
                  tilLesbarDatoMedArstall(
                    dayjs(soknad.tom).add(1, "days").toDate()
                  )
                )}
              </small>
              <span className="inngangspanel__tittel">{texts.tittel}</span>
            </h3>
            <p className="inngangspanel__status js-status">
              {textSoknadStatus(soknad.status)}
            </p>
          </header>
          <p className="inngangspanel__tekst js-tekst">
            {textTeaserText(tilLesbarPeriodeMedArstall(soknad.fom, soknad.tom))}
          </p>
          {soknad.arbeidsgiver && (
            <p className="inngangspanel__undertekst js-undertekst mute">
              {soknad.arbeidsgiver.navn}
            </p>
          )}
        </div>
      </button>
      {vis && <SoknadLightbox soknad={soknad} onClose={() => setVis(false)} />}
    </article>
  );
};

export default FremtidigSoknadTeaser;
