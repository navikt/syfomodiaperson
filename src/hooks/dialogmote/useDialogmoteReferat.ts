import { DialogmoteDTO } from "@/data/dialogmote/types/dialogmoteTypes";

export const useDialogmoteReferat = (dialogmote: DialogmoteDTO) => {
  const { referatList } = dialogmote;
  return {
    latestReferat: referatList[0],
    ferdigstilteReferat: referatList.filter((referat) => referat.ferdigstilt),
  };
};
