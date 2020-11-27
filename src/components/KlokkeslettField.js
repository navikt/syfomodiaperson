import React from "react";
import PropTypes from "prop-types";
import MaskedInput from "react-maskedinput";

const KlokkeslettField = (props) => {
  const { meta, className } = props;
  return (
    <div>
      <MaskedInput
        className={`skjemaelement__input ${className}${
          meta.touched && meta.error ? " skjemaelement__input--harFeil" : ""
        }`}
        mask="11.11"
        autoComplete="off"
        placeholder={props.placeholder}
        type={props.type || "text"}
        id={props.id}
        {...props.input}
      />
      <p className="skjemaelement__feilmelding" aria-live="polite">
        {meta.touched && meta.error}
      </p>
    </div>
  );
};

KlokkeslettField.propTypes = {
  meta: PropTypes.object,
  id: PropTypes.string,
  input: PropTypes.object,
  type: PropTypes.string,
  className: PropTypes.string,
  onKeyUp: PropTypes.func,
  placeholder: PropTypes.string,
};

export default KlokkeslettField;
