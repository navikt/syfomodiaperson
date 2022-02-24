import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { hentSykmeldinger } from "@/data/sykmelding/sykmeldinger_actions";
import { NOKKELINFORMASJON } from "@/enums/menypunkter";
import Side from "../../../sider/Side";
import Nokkelinformasjon from "../Nokkelinformasjon";
import { useValgtPersonident } from "@/hooks/useValgtBruker";
import SideLaster from "../../SideLaster";
import { useOppfolgingsplanerQuery } from "@/data/oppfolgingsplan/oppfolgingsplanQueryHooks";
import { useLedereQuery } from "@/data/leder/ledereQueryHooks";

const texts = {
  pageTitle: "Nøkkelinformasjon",
};

export const NokkelinformasjonSide = () => {
  const fnr = useValgtPersonident();
  const {
    aktivePlaner,
    isLoading: henterOppfolgingsplaner,
  } = useOppfolgingsplanerQuery();

  const sykmeldingerState = useSelector((state: any) => state.sykmeldinger);
  const {
    isLoading: henterLedere,
    isError: henterLedereFeilet,
  } = useLedereQuery();

  const henter = henterOppfolgingsplaner || henterLedere;
  const hentingFeilet = sykmeldingerState.hentingFeilet || henterLedereFeilet;
  const sykmeldinger = sykmeldingerState.data;

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(hentSykmeldinger(fnr));
  }, [dispatch, fnr]);

  return (
    <Side tittel={texts.pageTitle} aktivtMenypunkt={NOKKELINFORMASJON}>
      <SideLaster henter={henter} hentingFeilet={hentingFeilet}>
        <Nokkelinformasjon
          fnr={fnr}
          aktivePlaner={aktivePlaner}
          sykmeldinger={sykmeldinger}
          pageTitle={texts.pageTitle}
        />
      </SideLaster>
    </Side>
  );
};

export default NokkelinformasjonSide;
