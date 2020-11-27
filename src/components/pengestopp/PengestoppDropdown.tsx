import * as React from "react";
import Ekspanderbartpanel from "nav-frontend-ekspanderbartpanel";
import AlertStripe from "nav-frontend-alertstriper";
import { Checkbox, CheckboxGruppe } from "nav-frontend-skjema";
import { Element } from "nav-frontend-typografi";
import { restdatoTilLesbarDato } from "../../utils/datoUtils";
import { Arbeidsgiver } from "../../types/FlaggPerson";

const texts = {
  tittel: "Beskjed til NAV Arbeid og ytelser er sendt",
  sendt: "Sendt: ",
};

interface IPengestoppDropdown {
  dato: string;
  stoppedArbeidsgivere: Arbeidsgiver[];
}

const PengestoppDropdown = ({
  dato,
  stoppedArbeidsgivere,
}: IPengestoppDropdown) => {
  const warning = (
    <AlertStripe type="suksess" form="inline">
      <Element>{texts.tittel}</Element>
    </AlertStripe>
  );
  return (
    <Ekspanderbartpanel tittel={warning}>
      <p>
        {texts.sendt}
        <time>{restdatoTilLesbarDato(dato)}</time>
      </p>
      <CheckboxGruppe>
        {stoppedArbeidsgivere.map(
          (arbeidsgiver: Arbeidsgiver, index: number) => {
            return (
              <Checkbox
                key={index}
                label={arbeidsgiver.navn}
                checked
                disabled
              />
            );
          }
        )}
      </CheckboxGruppe>
    </Ekspanderbartpanel>
  );
};

export default PengestoppDropdown;
