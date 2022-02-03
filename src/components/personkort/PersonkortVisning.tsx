import React from "react";
import { PERSONKORTVISNING_TYPE } from "@/konstanter";
import { Brukerinfo } from "@/data/navbruker/types/Brukerinfo";
import { NarmesteLederRelasjonDTO } from "@/data/leder/ledere";
import VisningLege from "./PersonkortLege";
import VisningLedere from "./ledere/PersonkortLedere";
import PersonkortSykmeldt from "./PersonkortSykmeldt";
import VisningEnhet from "./PersonkortEnhet";

interface PersonkortVisningProps {
  ledere: NarmesteLederRelasjonDTO[];
  navbruker: Brukerinfo;
  sykmeldinger: any[];
  visning: string;
}

const PersonkortVisning = (personkortVisningProps: PersonkortVisningProps) => {
  const { ledere, navbruker, sykmeldinger, visning } = personkortVisningProps;
  const { LEGE, LEDER, ENHET } = PERSONKORTVISNING_TYPE;

  return (
    <div className="personkortVisning">
      {(() => {
        switch (visning) {
          case LEGE: {
            return <VisningLege />;
          }
          case LEDER: {
            return (
              <VisningLedere ledere={ledere} sykmeldinger={sykmeldinger} />
            );
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
