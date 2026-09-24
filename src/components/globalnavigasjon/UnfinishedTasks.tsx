import { Menypunkter } from "@/components/globalnavigasjon/GlobalNavigasjon";
import { BodyShort } from "@navikt/ds-react";

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
    <BodyShort size="small">{opActivePlanerText(tasks)}</BodyShort>
  ) : (
    <BodyShort
      size="small"
      className="min-w-[1.25em] h-[1.25em] bg-ax-danger-600 rounded-full text-center leading-[1.25em]"
      textColor="contrast"
    >
      {tasks}
    </BodyShort>
  );
}
