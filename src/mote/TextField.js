import React from "react";
import PropTypes from "prop-types";
import { Textarea } from "nav-frontend-skjema";

const TextField = (props) => {
  const { meta, label, id, input, maxLength } = props;
  const feilmelding = meta.touched && meta.error ? meta.error : undefined;
  return (
    <Textarea
      id={id}
      label={label}
      feil={feilmelding}
      maxLength={maxLength}
      {...input}
    />
  );
};

TextField.propTypes = {
  label: PropTypes.string,
  meta: PropTypes.object,
  id: PropTypes.string,
  input: PropTypes.object,
  type: PropTypes.string,
  onKeyUp: PropTypes.func,
  placeholder: PropTypes.string,
  maxLength: PropTypes.number,
};

export default TextField;
