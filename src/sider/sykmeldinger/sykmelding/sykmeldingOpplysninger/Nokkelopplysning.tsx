import React, { ReactNode } from "react";
import { FieldReadOnly } from "@/components/FieldReadOnly";

interface NokkelopplysningProps {
  label: string;
  children?: ReactNode;
  className?: string;
  isSubopplysning?: boolean;
}

export function Nokkelopplysning(nokkelopplysningProps: NokkelopplysningProps) {
  const {
    label,
    children,
    className = "",
    isSubopplysning = false,
  } = nokkelopplysningProps;
  return (
    <FieldReadOnly
      label={label}
      className={`${className} ${isSubopplysning && "ml-6"}`}
      classNameLabel={"nokkelopplysning__tittel"}
    >
      {children}
    </FieldReadOnly>
  );
}
