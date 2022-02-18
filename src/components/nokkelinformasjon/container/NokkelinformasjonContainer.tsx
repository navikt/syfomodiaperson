import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { hentSykmeldinger } from "@/data/sykmelding/sykmeldinger_actions";
import { hentLedere } from "@/data/leder/ledere_actions";
import { NOKKELINFORMASJON } from "@/enums/menypunkter";
import Side from "../../../sider/Side";
import Nokkelinformasjon from "../Nokkelinformasjon";
import { useValgtPersonident } from "@/hooks/useValgtBruker";
import SideLaster from "../../SideLaster";
import { useOppfolgingsplanerQuery } from "@/data/oppfolgingsplan/oppfolgingsplanQueryHooks";

const texts = {
  pageTitle: "Nøkkelinformasjon",
};

export const NokkelinformasjonSide = () => {
  const fnr = useValgtPersonident();
  const {
    aktivePlaner,
    isLoading: henterOppfolgingsplaner,
  } = useOppfolgingsplanerQuery();

  const ledereState = useSelector((state: any) => state.ledere);
  const sykmeldingerState = useSelector((state: any) => state.sykmeldinger);

  const henter = !ledereState.hentingForsokt || henterOppfolgingsplaner;
  const hentingFeilet = sykmeldingerState.hentingFeilet;
  const sykmeldinger = sykmeldingerState.data;

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(hentLedere(fnr));
    dispatch(hentSykmeldinger(fnr));
  }, [dispatch, fnr, ledereState]);

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
