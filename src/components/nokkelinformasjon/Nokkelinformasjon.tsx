import React from "react";
import Sidetopp from "../Sidetopp";
import UtdragFraSykefravaeret from "../utdragFraSykefravaeret/UtdragFraSykefravaeret";
import { Sykmeldingsgrad } from "@/components/sykmeldingsgrad/Sykmeldingsgrad";
import { useAppSelector } from "@/hooks/hooks";
import { ToggleNames } from "@/data/unleash/unleash_types";
import { OppfolgingsplanDTO } from "@/data/oppfolgingsplan/types/OppfolgingsplanDTO";

interface NokkelinformasjonProps {
  aktivePlaner: OppfolgingsplanDTO[];
  fnr: string;
  pageTitle: string;
}

const Nokkelinformasjon = (nokkelinformasjonProps: NokkelinformasjonProps) => {
  const { aktivePlaner, fnr, pageTitle } = nokkelinformasjonProps;

  const { toggles } = useAppSelector((state) => state.unleash);
  const visSykmeldingsgrad = toggles[ToggleNames.sykmeldingsgrad];

  return (
    <div>
      <Sidetopp tittel={pageTitle} />

      {visSykmeldingsgrad && <Sykmeldingsgrad />}

      <UtdragFraSykefravaeret aktivePlaner={aktivePlaner} fnr={fnr} />
    </div>
  );
};

export default Nokkelinformasjon;
