import React from "react";
import { Flatknapp } from "nav-frontend-knapper";
import { TrackedButtonProps } from "./trackedButtonTypes";
import { useTrackOnClick } from "@/data/logging/loggingHooks";

export const TrackedFlatknapp = (props: TrackedButtonProps) => {
  const trackButtonClick = useTrackOnClick();
  const { context, children, onClick, ...rest } = props;

  const modifiedOnClick = (event: any) => {
    trackButtonClick(children, context);
    onClick && onClick(event);
  };

  return (
    <Flatknapp {...rest} onClick={modifiedOnClick}>
      {children}
    </Flatknapp>
  );
};
