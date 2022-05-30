import { DialogmoteDTO } from "@/data/dialogmote/types/dialogmoteTypes";
import { useDialogmoterQuery } from "@/data/dialogmote/dialogmoteQueryHooks";
import { ReferatDTO } from "@/data/dialogmote/types/dialogmoteReferatTypes";

export const useLatestFerdigstiltReferat = (): ReferatDTO | undefined => {
  const { ferdigstilteDialogmoter } = useDialogmoterQuery();
  const latestFerdigstiltDialogmote: DialogmoteDTO | undefined =
    ferdigstilteDialogmoter.sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    })[0];
  return latestFerdigstiltDialogmote?.referatList.filter(
    (referat) => referat.ferdigstilt
  )[0];
};

export const useDialogmoteReferat = (dialogmote: DialogmoteDTO) => {
  const referatList = dialogmote?.referatList;
  const ferdigstilte = referatList.filter((referat) => referat.ferdigstilt);
  return {
    latestReferat: referatList[0],
    ferdigstilteReferat: ferdigstilte.map((referat, index) => ({
      ...referat,
      endring: index !== ferdigstilte.length - 1,
    })),
  };
};
