import { addWeeks } from "./datoUtils";

export const getForhandsvarselFrist = (): Date => {
  const today = new Date();
  const numberOfWeeks = 3;
  return addWeeks(today, numberOfWeeks);
};
