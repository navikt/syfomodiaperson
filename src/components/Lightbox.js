import React, { Component } from "react";
import PropTypes from "prop-types";

class Lightbox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      erApen: true,
    };
  }

  lukk() {
    const { onClose } = this.props;
    if (onClose) {
      onClose();
    }
    this.setState({
      erApen: false,
    });
  }

  renderLightboxInnhold() {
    const { children } = this.props;

    if (this.props.scrollOverflowY) {
      return (
        <div className="lightbox__innhold lightbox__innhold--medScroll">
          {children}
        </div>
      );
    }
    return <div className="lightbox__innhold">{children}</div>;
  }

  render() {
    if (!this.state.erApen) {
      return null;
    }
    return <div className="lightbox">{this.renderLightboxInnhold()}</div>;
  }
}
Lightbox.defaultProps = {
  scrollOverflowY: true,
};
Lightbox.propTypes = {
  children: PropTypes.element,
  onClose: PropTypes.func,
  scrollOverflowY: PropTypes.bool,
};

export default Lightbox;
