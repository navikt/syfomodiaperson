import React, { ReactNode } from "react";
import { FieldReadOnly } from "@/components/FieldReadOnly";

interface Props {
  label: string;
  children: ReactNode;
  className?: string;
  isSubopplysning?: boolean;
}

export function Nokkelopplysning({
  label,
  children,
  className = "",
  isSubopplysning = false,
}: Props) {
  return (
    <FieldReadOnly
      label={label}
      className={`${className} ${isSubopplysning ? "ml-6" : ""}`}
      classNameLabel={"nokkelopplysning__tittel"}
    >
      {children}
    </FieldReadOnly>
  );
}
