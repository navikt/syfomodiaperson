import { addWeeks } from "./datoUtils";

export const getForhandsvarselFrist = (): Date => {
  const today = new Date();
  const nov26 = new Date(today.getFullYear(), 10, 26);
  const dec16 = new Date(today.getFullYear(), 11, 16);
  const numberOfWeeks = nov26 < today && today < dec16 ? 6 : 3;
  return addWeeks(today, numberOfWeeks);
};
