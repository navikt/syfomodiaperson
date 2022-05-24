import React from "react";
import { Hovedknapp } from "nav-frontend-knapper";
import { TrackedButtonProps } from "./trackedButtonTypes";
import { useTrackOnClick } from "@/data/logging/loggingHooks";

export const TrackedHovedknapp = (props: TrackedButtonProps) => {
  const trackButtonClick = useTrackOnClick();
  const { context, children, onClick, ...rest } = props;

  const modifiedOnClick = (event: any) => {
    trackButtonClick(children, context);
    onClick && onClick(event);
  };

  return (
    <Hovedknapp {...rest} onClick={modifiedOnClick}>
      {children}
    </Hovedknapp>
  );
};
