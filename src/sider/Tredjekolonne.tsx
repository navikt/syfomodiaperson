import React, { ReactElement } from "react";

interface TredjekolonneProps {
  heightStyling: string;
  screenWidth: number;
  children: ReactElement;
}

export const Tredjekolonne = ({
  heightStyling,
  screenWidth,
  children,
}: TredjekolonneProps) => {
  return (
    <div
      style={
        screenWidth > 1300
          ? {
              height: heightStyling,
              overflowY: "scroll",
            }
          : { overflowY: "unset" }
      }
    >
      {children}
    </div>
  );
};
