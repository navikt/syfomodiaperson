import { useState } from "react";
import { harFeilmeldinger, SkjemaFeil } from "@/utils/valideringUtils";

export const useFeilUtbedret = () => {
  const [feilUtbedret, setFeilUtbedret] = useState<boolean | undefined>();
  const harIkkeUtbedretFeil = feilUtbedret === false;
  const resetFeilUtbedret = () => setFeilUtbedret(false);
  const updateFeilUtbedret = (feil: Partial<SkjemaFeil>) => {
    if (harIkkeUtbedretFeil && !harFeilmeldinger(feil)) {
      setFeilUtbedret(true);
    }
  };

  return {
    harIkkeUtbedretFeil,
    resetFeilUtbedret,
    updateFeilUtbedret,
  };
};
