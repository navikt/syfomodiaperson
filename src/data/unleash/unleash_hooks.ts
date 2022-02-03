import { useAppSelector } from "@/hooks/hooks";
import { ToggleNames } from "@/data/unleash/unleash_types";

export const useDM2FeatureToggles: () => {
  triedFetchingToggles: boolean;
  isDm2Enabled: boolean;
} = () => {
  const { toggles, triedFetchingToggles } = useAppSelector(
    (state) => state.unleash
  );
  return {
    triedFetchingToggles,
    isDm2Enabled: toggles[ToggleNames.dm2],
  };
};
