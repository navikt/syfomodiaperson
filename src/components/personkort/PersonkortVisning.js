import React from "react";
import PropTypes from "prop-types";
import { PERSONKORTVISNING_TYPE } from "../../konstanter";
import VisningLege from "./PersonkortLege";
import VisningLedere from "./ledere/PersonkortLedere";
import PersonkortSykmeldt from "./PersonkortSykmeldt";
import VisningEnhet from "./PersonkortEnhet";

export const VelgVisning = ({
  navbruker,
  personadresse,
  ledere,
  fastleger,
  behandlendeEnhet,
  visning,
  sykmeldinger,
}) => {
  const { LEGE, LEDER, ENHET } = PERSONKORTVISNING_TYPE;
  switch (visning) {
    case LEGE: {
      return <VisningLege fastleger={fastleger} />;
    }
    case LEDER: {
      return <VisningLedere ledere={ledere} sykmeldinger={sykmeldinger} />;
    }
    case ENHET: {
      return <VisningEnhet behandlendeEnhet={behandlendeEnhet} />;
    }
    default: {
      return (
        <PersonkortSykmeldt
          navbruker={navbruker}
          personadresse={personadresse}
        />
      );
    }
  }
};

VelgVisning.propTypes = {
  visning: PropTypes.string,
  navbruker: PropTypes.object,
  personadresse: PropTypes.object,
  ledere: PropTypes.array,
  fastleger: PropTypes.object,
  behandlendeEnhet: PropTypes.object,
  sykmeldinger: PropTypes.arrayOf(PropTypes.object),
};

const PersonkortVisning = (props) => {
  return (
    <div className="personkortVisning">
      <VelgVisning {...props} />
    </div>
  );
};

export default PersonkortVisning;
