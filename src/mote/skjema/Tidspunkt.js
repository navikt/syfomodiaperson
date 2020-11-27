import React from "react";
import PropTypes from "prop-types";
import { Field } from "redux-form";
import { Row, Column } from "nav-frontend-grid";
import Datovelger from "../../components/datovelger/Datovelger";
import KlokkeslettField from "../../components/KlokkeslettField";
import { formaterTid } from "../../utils";

const texts = {
  header: "Nytt tidspunkt",
  dateLabel: "Dato",
  datePlaceholder: "dd.mm.åååå",
  timeLabel: "Klokkeslett",
  timePlaceholder: "F.eks: 09.30",
};

const Tidspunkt = ({ tidspunkt, skjemanavn }) => {
  const datoName = `tidspunkter[${tidspunkt}].dato`;
  const klokkeslettName = `tidspunkter[${tidspunkt}].klokkeslett`;

  return (
    <div className="motetidspunkter__tidspunkt blokk js-tidspunkt">
      <h4 className="typo-element blokk--s">{texts.header}</h4>
      <div className="blokk">
        <Row>
          <Column className="col-xs-12 col-sm-6">
            <label
              className="skjemaelement__label"
              htmlFor={`dato-${tidspunkt}`}
            >
              {texts.dateLabel}
            </label>
            <Datovelger
              id={`dato-${tidspunkt}`}
              name={datoName}
              placeholder={texts.datePlaceholder}
              skjemanavn={skjemanavn}
            />
          </Column>
          <Column className="col-xs-12 col-sm-6">
            <label
              className="skjemaelement__label"
              htmlFor={`klokkeslett-${tidspunkt}`}
            >
              {texts.timeLabel}
            </label>
            <Field
              parse={(e) => {
                return formaterTid(e);
              }}
              id={`klokkeslett-${tidspunkt}`}
              component={KlokkeslettField}
              name={klokkeslettName}
              className="input--s"
              placeholder={texts.timePlaceholder}
            />
          </Column>
        </Row>
      </div>
    </div>
  );
};

Tidspunkt.propTypes = {
  tidspunkt: PropTypes.number,
  skjemanavn: PropTypes.string.isRequired,
};

export default Tidspunkt;
