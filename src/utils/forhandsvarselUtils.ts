import { addWeeks } from "./datoUtils";

export const getForhandsvarselFrist = (): Date => {
  const today = new Date();
  const nov26 = new Date(today.getFullYear(), 10, 26);
  const dec19 = new Date(today.getFullYear(), 11, 19);
  const numberOfWeeks = nov26 < today && today < dec19 ? 6 : 3;
  return addWeeks(today, numberOfWeeks);
};
