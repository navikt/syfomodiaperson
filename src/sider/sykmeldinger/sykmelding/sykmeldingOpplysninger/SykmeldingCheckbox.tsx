import React from "react";
import { CheckboxPng } from "../../../../../img/ImageComponents";

interface SykmeldingCheckboxProps {
  tekst: string;
  className?: string;
  isSubopplysning?: boolean;
}

export const SykmeldingCheckbox = (
  sykmeldingCheckboxProps: SykmeldingCheckboxProps
) => {
  const {
    tekst,
    className = "",
    isSubopplysning = false,
  } = sykmeldingCheckboxProps;
  return (
    <p
      className={`mb-1 flex break-after-avoid ${className} ${
        isSubopplysning && "ml-6"
      }`}
    >
      <img
        src={CheckboxPng}
        className="ikon self-start inline-block w-4 h-auto mr-1 mt-0.5 align-top"
        alt="Huket av"
      />
      <span className={"flex-1"}>{tekst}</span>
    </p>
  );
};
