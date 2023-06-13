import { useEffect } from "react";

interface HotjarWindow extends Window {
  hj: (name: string, value: string) => void;
}

export function useHotJarMotebehovTrigger() {
  useEffect(() => {
    const hotJarWindow = window as unknown as HotjarWindow;

    setTimeout(() => {
      if (typeof hotJarWindow.hj !== "function") {
        return;
      } else {
        hotJarWindow.hj("trigger", "syfomodiaperson-motebehovskjema");
      }
    }, 500);
  });
}
