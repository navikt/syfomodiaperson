import { DialogmoteDTO } from "@/data/dialogmote/types/dialogmoteTypes";

export const useDialogmoteReferat = (dialogmote: DialogmoteDTO) => {
  const { referatList } = dialogmote;
  return {
    ferdigstiltReferat: referatList.find((referat) => referat.ferdigstilt),
    mellomlagretReferat: referatList.find((referat) => !referat.ferdigstilt),
  };
};
