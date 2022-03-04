import React from "react";
import Sidetopp from "../Sidetopp";
import UtdragFraSykefravaeret from "../utdragFraSykefravaeret/UtdragFraSykefravaeret";
import { Sykmeldingsgrad } from "@/components/sykmeldingsgrad/Sykmeldingsgrad";
import { ToggleNames } from "@/data/unleash/unleash_types";
import { OppfolgingsplanDTO } from "@/data/oppfolgingsplan/types/OppfolgingsplanDTO";
import { useFeatureToggles } from "@/data/unleash/unleashQueryHooks";

interface NokkelinformasjonProps {
  aktivePlaner: OppfolgingsplanDTO[];
  fnr: string;
  pageTitle: string;
}

const Nokkelinformasjon = (nokkelinformasjonProps: NokkelinformasjonProps) => {
  const { aktivePlaner, fnr, pageTitle } = nokkelinformasjonProps;

  const { isFeatureEnabled } = useFeatureToggles();
  const visSykmeldingsgrad = isFeatureEnabled(ToggleNames.sykmeldingsgrad);

  return (
    <div>
      <Sidetopp tittel={pageTitle} />

      {visSykmeldingsgrad && <Sykmeldingsgrad />}

      <UtdragFraSykefravaeret aktivePlaner={aktivePlaner} fnr={fnr} />
    </div>
  );
};

export default Nokkelinformasjon;
