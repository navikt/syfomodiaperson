import React, { JSX } from "react";
import SykmeldingOpplysning from "./SykmeldingOpplysning";
import { OpplysningListItem } from "@/sider/sykmeldinger/sykmelding/sykmeldingOpplysninger/OpplysningListItem";

interface Props {
  sykmeldingBolk: { [key: string]: any };
  felt: string;
  tittel: string;
  opplysning?: string;
  Overskrift?: keyof JSX.IntrinsicElements;
  isSubopplysning?: boolean;
}

export const SykmeldingOpplysningForFelt = ({
  sykmeldingBolk,
  felt,
  tittel,
  opplysning,
  isSubopplysning = false,
}: Props) =>
  sykmeldingBolk[felt] ? (
    <SykmeldingOpplysning tittel={tittel} isSubopplysning={isSubopplysning}>
      <OpplysningListItem>
        {opplysning || sykmeldingBolk[felt]}
      </OpplysningListItem>
    </SykmeldingOpplysning>
  ) : null;
