import React, { ReactNode } from "react";

interface FieldReadOnlyProps {
  label: string;
  children: ReactNode;
  className?: string;
  classNameLabel?: string;
}

export function FieldReadOnly(fieldReadOnlyProps: FieldReadOnlyProps) {
  const {
    label,
    className = "",
    classNameLabel = "",
    children,
  } = fieldReadOnlyProps;

  return (
    <div
      className={`navds-body-short--small inline-table w-full mb-5 ${className}`}
    >
      <div className={`navds-label mt-0 mb-1 ${classNameLabel}`}>{label}</div>
      {children}
    </div>
  );
}
