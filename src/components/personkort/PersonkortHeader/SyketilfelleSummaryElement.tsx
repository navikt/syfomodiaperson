import React from "react";

interface Props {
  keyword: string;
  value: string;
}

export function SyketilfelleSummaryElement({ keyword, value }: Props) {
  return (
    <div className="font-normal">
      <span>{keyword}</span>
      <b>{value}</b>
    </div>
  );
}
