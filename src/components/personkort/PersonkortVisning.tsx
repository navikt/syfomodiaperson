import React from "react";
import { PERSONKORTVISNING_TYPE } from "@/konstanter";
import VisningLege from "./PersonkortLege";
import VisningLedere from "./ledere/PersonkortLedere";
import PersonkortSykmeldt from "./PersonkortSykmeldt";
import VisningEnhet from "./PersonkortEnhet";

interface PersonkortVisningProps {
  visning: string;
}

const PersonkortVisning = (personkortVisningProps: PersonkortVisningProps) => {
  const { visning } = personkortVisningProps;
  const { LEGE, LEDER, ENHET } = PERSONKORTVISNING_TYPE;

  return (
    <div className="personkortVisning">
      {(() => {
        switch (visning) {
          case LEGE: {
            return <VisningLege />;
          }
          case LEDER: {
            return <VisningLedere />;
          }
          case ENHET: {
            return <VisningEnhet />;
          }
          default: {
            return <PersonkortSykmeldt />;
          }
        }
      })()}
    </div>
  );
};

export default PersonkortVisning;
