import React, { ReactNode } from "react";

interface Props {
  label: string;
  children: ReactNode;
  className?: string;
  classNameLabel?: string;
}

export function FieldReadOnly({
  label,
  className = "",
  classNameLabel = "",
  children,
}: Props) {
  return (
    <div
      className={`aksel-body-short--small inline-table w-full mb-5 ${className}`}
    >
      <div className={`aksel-label mt-0 mb-1 ${classNameLabel}`}>{label}</div>
      {children}
    </div>
  );
}
