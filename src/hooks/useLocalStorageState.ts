import { useEffect, useState } from "react";

export enum StoreKey {
  FLEXJAR_SEN_FASE_FEEDBACK_DATE = "flexjarSenFaseFeedbackDate",
  FLEXJAR_ARBEIDSUFORHET_FEEDBACK_DATE = "flexjarArbeidsuforhetFeedbackDate",
  MALFORM = "malform",
}

export const useLocalStorageState = <T>(key: StoreKey) => {
  const item = localStorage.getItem(key);
  const [state, setState] = useState<T | null>(() => {
    try {
      return item === null ? null : JSON.parse(item);
    } catch (error) {
      return null;
    }
  });
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state));
  }, [state, key]);
  return { storedValue: state, setStoredValue: setState } as const;
};
