import { useParams } from "react-router-dom";
import React from "react";

// Workaround for using react-router v6 in class-based mote components.
export function withRouter(Children) {
  // eslint-disable-next-line react/display-name
  return (props) => {
    const match = { params: useParams() };
    return <Children {...props} match={match} />;
  };
}
