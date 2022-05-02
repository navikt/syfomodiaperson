import { useFeatureToggles } from "@/data/unleash/unleashQueryHooks";
import { ToggleNames } from "@/data/unleash/unleash_types";

export const useDialogmotekandidat = () => {
  const { isFeatureEnabled } = useFeatureToggles();
  const visDialogmotekandidat = isFeatureEnabled(
    ToggleNames.dialogmotekandidat
  );

  return {
    isKandidat: visDialogmotekandidat,
  };
};
