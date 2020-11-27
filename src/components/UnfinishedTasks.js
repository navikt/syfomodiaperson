import React from "react";
import PropTypes from "prop-types";
import * as menypunkter from "../enums/menypunkter";

const opActivePlanerText = (tasks) => {
  const activeText = tasks > 1 ? "aktive" : "aktiv";

  return `(${tasks} ${activeText})`;
};

const UnfinishedTasks = ({ tasks, menypunkt }) => {
  return menypunkt === menypunkter.OPPFOELGINGSPLANER ? (
    <p className="antallNytt__oppfolgingsplan">{opActivePlanerText(tasks)}</p>
  ) : (
    <i className="antallNytt">{tasks}</i>
  );
};

UnfinishedTasks.propTypes = {
  tasks: PropTypes.number,
  menypunkt: PropTypes.string,
};

export default UnfinishedTasks;
