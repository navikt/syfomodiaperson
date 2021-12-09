import { useAppSelector } from "@/hooks/hooks";
import { ToggleNames } from "@/data/unleash/unleash_types";

export const useDM2FeatureToggles: () => {
  triedFetchingToggles: boolean;
  isDm2Enabled: boolean;
  isDm2FysiskBrevEnabled: boolean;
  isDm2InnkallingFastlegeEnabled: boolean;
} = () => {
  const { toggles, triedFetchingToggles } = useAppSelector(
    (state) => state.unleash
  );
  return {
    triedFetchingToggles,
    isDm2Enabled: toggles[ToggleNames.dm2],
    isDm2FysiskBrevEnabled: toggles[ToggleNames.dm2VarselFysiskBrev],
    isDm2InnkallingFastlegeEnabled: toggles[ToggleNames.dm2InnkallingFastlege],
  };
};
