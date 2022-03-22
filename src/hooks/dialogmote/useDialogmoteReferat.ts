import { DialogmoteDTO } from "@/data/dialogmote/types/dialogmoteTypes";

export const useDialogmoteReferat = (dialogmote: DialogmoteDTO) => {
  const { referatList } = dialogmote;
  const ferdigstilte = referatList.filter((referat) => referat.ferdigstilt);
  return {
    latestReferat: referatList[0],
    ferdigstilteReferat: ferdigstilte.map((referat, index) => ({
      ...referat,
      endring: index !== ferdigstilte.length - 1,
    })),
  };
};
