import React from "react";
import PropTypes from "prop-types";
import { scrollTo, erSynligIViewport } from "@/utils/browserUtils";

class Utvidbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      erApen: props.erApen,
      ikon: props.ikon,
      containerClassName: "",
      hindreToggle: false,
      hoyde: !props.erApen ? "0" : "auto",
      visInnhold: props.erApen,
      harTransisjon: false,
    };
  }

  onMouseEnter() {
    this.setState({
      ikon: this.props.ikonHover,
    });
  }

  onMouseLeave() {
    this.setState({
      ikon: this.props.ikon,
    });
  }

  onTransitionEnd() {
    if (this.state.harTransisjon) {
      // Forhindrer scrolling til utenforliggnede
      // Utvidbar dersom flere er nøstet inni hverandre
      this.setState({
        harTransisjon: false,
      });
      if (this.state.erApen) {
        scrollTo(this.utvidbar, 600);
        this.setState({
          hindreToggle: false,
        });
        this.setAutoHoyde();
      } else {
        this.setState({
          hindreToggle: false,
          visInnhold: false,
        });
        if (!erSynligIViewport(this.utvidbar)) {
          scrollTo(this.utvidbar, 600);
        }
        this["js-toggle"].focus();
      }
    }
  }

  getHeaderClassName() {
    let c = !this.state.erApen
      ? "utvidbar_old__header"
      : "utvidbar_old__header utvidbar_old__header--erApen";
    if (this.props.variant) {
      c = `${c} utvidbar_old__header--${this.props.variant}`;
    }
    return c;
  }

  setAutoHoyde() {
    /* Fjerner animasjonsklassen slik at Safari ikke
        tegner komponenten på nytt når høyde settes til 'auto': */
    this.setState({
      containerClassName: "",
    });
    // Setter høyde til auto:
    setTimeout(() => {
      this.setState({
        hoyde: "auto",
        containerClassName: "",
      });
    }, 0);
  }

  apne() {
    this.props.onExpand && this.props.onExpand();

    this.setState({
      hoyde: "0",
      hindreToggle: true,
      containerClassName: " utvidbar_old__innholdContainer--medAnimasjon",
      visInnhold: true,
      harTransisjon: true,
    });
    setTimeout(() => {
      const hoyde = this.innhold?.offsetHeight || "auto";
      this.setState({
        erApen: true,
        hoyde,
      });
    }, 10);
  }

  lukk() {
    const hoyde = this.innhold.offsetHeight;
    this.setState({
      hoyde,
      hindreToggle: true,
      harTransisjon: true,
    });
    setTimeout(() => {
      this.setState({
        containerClassName: " utvidbar_old__innholdContainer--medAnimasjon",
        hoyde: "0",
        erApen: false,
      });
    }, 10);
  }

  toggle(e) {
    e.preventDefault();
    if (!this.state.hindreToggle) {
      /* hindreToggle for å hindre dobbelklikk,
            eller at noen klikker mens animasjonen pågår.
            Dobbelklikk vil skape kluss med logikken. */
      if (this.state.erApen) {
        this.lukk();
      } else {
        this.apne();
      }
    }
  }

  render() {
    return (
      <div
        ref={(c) => {
          this.utvidbar = c;
        }}
        className={`utvidbar_old ${
          this.props.className ? this.props.className : ""
        }`}
      >
        <a
          href="javascript:void(0)"
          aria-expanded={this.state.erApen}
          ref={(c) => {
            this["js-toggle"] = c;
          }}
          role="button"
          onMouseEnter={() => {
            this.onMouseEnter();
          }}
          onMouseLeave={() => {
            this.onMouseLeave();
          }}
          onClick={(event) => {
            if (this.props.onClick) {
              this.props.onClick(this.state.erApen);
            }
            this.toggle(event);
          }}
          className="utvidbar_old__toggle"
        >
          <this.props.Overskrift className={this.getHeaderClassName()}>
            {this.state.ikon && (
              <img
                aria-hidden="true"
                src={this.state.ikon}
                alt={this.props.ikonAltTekst}
                className="utvidbar_old__ikon"
              />
            )}
            <div
              className={
                !this.state.erApen
                  ? "utvidbar_old__tittel"
                  : "utvidbar_old__tittel utvidbar_old__tittel--erApen"
              }
            >
              {this.props.tittel}
            </div>
            <em className="utvidbar_old__handling">
              <span className="utvidbar_old__handling__tekst">
                {this.state.erApen ? "Lukk" : "Åpne"}
              </span>
            </em>
          </this.props.Overskrift>
        </a>
        <div
          ref={(c) => {
            this.container = c;
          }}
          style={{ height: this.state.hoyde }}
          className={`utvidbar_old__innholdContainer${this.state.containerClassName}`}
          onTransitionEnd={() => {
            this.onTransitionEnd();
          }}
        >
          <div
            className="utvidbar_old__innhold"
            ref={(c) => {
              this.innhold = c;
            }}
          >
            {this.state.visInnhold && (
              <div>
                {this.props.children}
                {this.props.visLukklenke && (
                  <div className="knapperad ikke-print">
                    <button
                      type="button"
                      className="lenke"
                      aria-pressed={!this.state.erApen}
                      tabIndex={this.state.erApen ? null : "-1"}
                      onClick={(event) => {
                        this.toggle(event);
                      }}
                    >
                      Lukk
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

Utvidbar.propTypes = {
  erApen: PropTypes.bool.isRequired,
  tittel: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
  children: PropTypes.node,
  ikon: PropTypes.string,
  ikonHover: PropTypes.string,
  ikonAltTekst: PropTypes.string,
  className: PropTypes.string,
  variant: PropTypes.string,
  visLukklenke: PropTypes.bool.isRequired,
  onClick: PropTypes.func,
  onExpand: PropTypes.func,
};

Utvidbar.defaultProps = {
  erApen: false,
  Overskrift: "h3",
  visLukklenke: true,
};

export default Utvidbar;
