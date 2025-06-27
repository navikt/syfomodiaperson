import React from "react";
import { Menypunkter } from "@/components/globalnavigasjon/GlobalNavigasjon";

const opActivePlanerText = (tasks: number) => {
  const activeText = tasks > 1 ? "aktive" : "aktiv";
  return `(${tasks} ${activeText})`;
};

interface Props {
  tasks: number;
  menypunkt: Menypunkter;
}

export default function UnfinishedTasks(unfinishedTasksProps: Props) {
  const { tasks, menypunkt } = unfinishedTasksProps;
  return menypunkt === Menypunkter.OPPFOELGINGSPLANER ? (
    <p>{opActivePlanerText(tasks)}</p>
  ) : (
    <p className="antallNytt">{tasks}</p>
  );
}
