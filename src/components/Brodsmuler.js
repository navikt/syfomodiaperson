import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router";

const Brodsmule = ({ sti, tittel, sisteSmule, erKlikkbar }) => {
  if (sisteSmule) {
    return (
      <span className="js-smuletekst">
        <span className="vekk">Du er her:</span>{" "}
        <span className="brodsmule">{tittel}</span>
      </span>
    );
  } else if (erKlikkbar) {
    return (
      <span className="js-smuletekst">
        <Link className="js-smule brodsmule" to={`/sykefravaer/${sti}`}>
          {tittel}
        </Link>
        <span className="brodsmule__skille"> / </span>
      </span>
    );
  }
  return (
    <span>
      <span className="brodsmule">{tittel}</span>
      <span className="brodsmule__skille"> / </span>
    </span>
  );
};

Brodsmule.propTypes = {
  sti: PropTypes.string,
  tittel: PropTypes.string,
  sisteSmule: PropTypes.bool,
  erKlikkbar: PropTypes.bool,
};

const ToggleLink = ({ onClick }) => {
  return (
    <span>
      <a
        role="button"
        aria-label="Vis hele brødsmulestien"
        className="js-toggle brodsmule"
        href="#"
        onClick={onClick}
      >
        ...
      </a>
      <span className="brodsmule__skille"> / </span>
    </span>
  );
};

ToggleLink.propTypes = {
  onClick: PropTypes.func,
};

class Brodsmuler extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visCollapsed: true,
    };
  }

  getSynligeBrodsmuler() {
    const { brodsmuler } = this.props;
    if (this.visCollapsed()) {
      return [
        brodsmuler[brodsmuler.length - 2],
        brodsmuler[brodsmuler.length - 1],
      ];
    }
    return brodsmuler;
  }

  visCollapsed() {
    return this.props.brodsmuler.length > 3 && this.state.visCollapsed;
  }

  visAlleBrodsmuler() {
    this.setState({
      visCollapsed: false,
    });
  }

  render() {
    const { brodsmuler } = this.props;
    const synligeBrodsmuler = this.getSynligeBrodsmuler();
    return (
      <nav
        role="navigation"
        className="brodsmuler side-innhold"
        aria-label="Du er her: "
      >
        <img
          src="/sykefravaer/img/svg/person.svg"
          alt="Du"
          className="brodsmuler__ikon"
        />
        <span className="js-smule brodsmule">Ditt NAV</span>
        {brodsmuler.length && <span className="brodsmule__skille"> / </span>}
        {this.visCollapsed() && (
          <ToggleLink
            onClick={(e) => {
              e.preventDefault();
              this.visAlleBrodsmuler();
            }}
          />
        )}
        {synligeBrodsmuler
          .map((smule, index) => {
            return Object.assign({}, smule, {
              sisteSmule: synligeBrodsmuler.length === index + 1,
            });
          })
          .map((smule, index) => {
            return <Brodsmule key={index} {...smule} />;
          })}
      </nav>
    );
  }
}

Brodsmuler.propTypes = {
  brodsmuler: PropTypes.array,
};

export default Brodsmuler;
