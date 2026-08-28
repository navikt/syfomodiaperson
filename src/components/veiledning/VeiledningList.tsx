import { List } from "@navikt/ds-react";
import React from "react";

export function VeiledningList({
  as,
  children,
}: {
  as: "ol" | "ul";
  children: React.ReactNode;
}) {
  return (
    <List
      as={as}
      size="small"
      // Korter ned margin i toppen av underlister og avstanden mellom punkter i underlister litt
      className="[&_ul_ul]:mt-1 [&_ul_ul_li:not(:last-child)]:mb-1"
    >
      {children}
    </List>
  );
}
