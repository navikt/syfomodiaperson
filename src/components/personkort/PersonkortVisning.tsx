import React from "react";
import { PERSONKORTVISNING_TYPE } from "@/konstanter";
import { Brukerinfo } from "@/data/navbruker/types/Brukerinfo";
import VisningLege from "./PersonkortLege";
import VisningLedere from "./ledere/PersonkortLedere";
import PersonkortSykmeldt from "./PersonkortSykmeldt";
import VisningEnhet from "./PersonkortEnhet";

interface PersonkortVisningProps {
  navbruker: Brukerinfo;
  sykmeldinger: any[];
  visning: string;
}

const PersonkortVisning = (personkortVisningProps: PersonkortVisningProps) => {
  const { navbruker, sykmeldinger, visning } = personkortVisningProps;
  const { LEGE, LEDER, ENHET } = PERSONKORTVISNING_TYPE;

  return (
    <div className="personkortVisning">
      {(() => {
        switch (visning) {
          case LEGE: {
            return <VisningLege />;
          }
          case LEDER: {
            return <VisningLedere sykmeldinger={sykmeldinger} />;
          }
          case ENHET: {
            return <VisningEnhet />;
          }
          default: {
            return <PersonkortSykmeldt navbruker={navbruker} />;
          }
        }
      })()}
    </div>
  );
};

export default PersonkortVisning;
