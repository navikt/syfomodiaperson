import { useMemo } from "react";

export const usePageHeight = (
  hasLoaded: boolean
): { height: number; heightStyling: string } => {
  const headerHeight = useMemo(() => {
    if (!hasLoaded) {
      return 0;
    }
    const sidetoppHeight =
      document.getElementById("modia-header")?.clientHeight || 0;
    const sideoverskriftHeight =
      document.getElementById("sideoverskrift")?.clientHeight || 0;
    const decoratorHeight =
      document.getElementById("internflatedecorator")?.clientHeight || 0;

    return sidetoppHeight + sideoverskriftHeight + decoratorHeight;
  }, [hasLoaded]);

  const heightStyling = useMemo(
    () => `calc(100vh - ${headerHeight}px)`,
    [headerHeight]
  );

  return {
    height: headerHeight,
    heightStyling: heightStyling,
  };
};
