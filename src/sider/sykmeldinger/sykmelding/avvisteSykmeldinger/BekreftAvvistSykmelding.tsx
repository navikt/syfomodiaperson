import React, { ReactElement } from "react";
import { Checkbox } from "nav-frontend-skjema";
import { Hovedknapp } from "nav-frontend-knapper";

const texts = {
  confirm: "Bekreft",
  confirmCheckboxLabel:
    "Jeg bekrefter at jeg har lest at sykmeldingen er avvist",
};

const BekreftAvvistSykmelding = (): ReactElement => {
  return (
    <>
      <div>
        <Checkbox
          className="bekreftCheckboksPanel max-w-md mr-auto ml-auto"
          label={texts.confirmCheckboxLabel}
          disabled
        />
      </div>
      <div className="knapperad">
        <Hovedknapp disabled>{texts.confirm}</Hovedknapp>
      </div>
    </>
  );
};

export default BekreftAvvistSykmelding;
