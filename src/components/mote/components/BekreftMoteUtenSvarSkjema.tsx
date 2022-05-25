import React from "react";
import { Link } from "react-router-dom";
import AlertStripe from "nav-frontend-alertstriper";
import KnappBase from "nav-frontend-knapper";

export const tekster = {
  mote: {
    bekreftmote: {
      feil: "Det skjedde en feil",
    },
    bekreftmoteutensvar: {
      lightboxOverskrift: "Har du avklart møtet på andre måter?",
      lightboxSendKnapp: "ja, dette er avklart",
      lightboxAvbrytKnapp: "Avbryt",
    },
  },
};

interface BekreftMoteUtenSvarSkjemaProps {
  avbrytHref: string;
  bekrefter: boolean;
  bekreftFeilet: boolean;
  bekreftMoteUtenSvar: any;
}

const BekreftMoteUtenSvarSkjema = (
  bekreftMoteUtenSvarSkjemaProps: BekreftMoteUtenSvarSkjemaProps
) => {
  const { bekrefter, bekreftFeilet, avbrytHref, bekreftMoteUtenSvar } =
    bekreftMoteUtenSvarSkjemaProps;

  return (
    <div className="bekreftutensvarinnhold">
      <h2 className="sidetopp__tittel">
        {tekster.mote.bekreftmoteutensvar.lightboxOverskrift}
      </h2>
      <div aria-live="polite" role="alert">
        {bekreftFeilet && (
          <div className="blokk">
            <AlertStripe type="advarsel">
              <p>{tekster.mote.bekreftmote.feil}</p>
            </AlertStripe>
          </div>
        )}
      </div>
      <div className="blokk--s">
        <KnappBase
          type="standard"
          spinner={bekrefter}
          disabled={bekrefter}
          onClick={bekreftMoteUtenSvar}
        >
          {tekster.mote.bekreftmoteutensvar.lightboxSendKnapp}
        </KnappBase>
        <Link to={avbrytHref} className="hjelpetekstlenke">
          {tekster.mote.bekreftmoteutensvar.lightboxAvbrytKnapp}
        </Link>
      </div>
    </div>
  );
};

export default BekreftMoteUtenSvarSkjema;
