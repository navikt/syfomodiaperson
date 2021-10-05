import React from "react";
import styled from "styled-components";
import EtikettBase from "nav-frontend-etiketter";
import { Brukerinfo } from "@/data/navbruker/types/Brukerinfo";
import {
  formaterFnr,
  hentBrukersAlderFraFnr,
  hentBrukersKjoennFraFnr,
} from "@/utils/fnrUtils";
import { KJOENN } from "@/konstanter";
import { sykmeldingerHasCoronaDiagnose } from "@/utils/sykmeldinger/sykmeldingUtils";
import { tilLesbarDatoMedArUtenManedNavn } from "@/utils/datoUtils";
import CopyButton from "../kopierknapp/CopyButton";
import { KvinneImage, MannImage } from "../../../img/ImageComponents";
import { useAppSelector } from "@/hooks/hooks";
import ErrorBoundary from "../ErrorBoundary";
import { useStartDateFromLatestOppfolgingstilfellePeriode } from "@/data/oppfolgingstilfelle/oppfolgingstilfellerperson_hooks";
import { useEgenansattQuery } from "@/data/egenansatt/egenansattQueryHooks";
import { useValgtPersonident } from "@/hooks/useValgtBruker";

const texts = {
  copied: "Kopiert!",
  startDate: "Sykmeldt f.o.m.: ",
  fetchDiskresjonskodeFailed: "Klarte ikke hente diskresjonskode for brukeren.",
};

interface HeaderInfoStartDateProps {
  startDate: any;
}

const HeaderInfoStartDate = (
  headerInfoStartDateProps: HeaderInfoStartDateProps
) => {
  const { startDate } = headerInfoStartDateProps;
  return (
    <>
      {!!startDate && (
        <React.Fragment>
          <span className="startdate__text">{texts.startDate}</span>
          <span className="startdate__date">
            {tilLesbarDatoMedArUtenManedNavn(startDate)}
          </span>
        </React.Fragment>
      )}
    </>
  );
};

const StyledFnr = styled.div`
  display: flex;

  img {
    padding-left: 0.5em;
    width: auto;
    height: 1.2em;
  }
`;

interface PersonkortHeaderProps {
  navbruker: Brukerinfo;
  sykmeldinger: any[];
}

const PersonkortHeader = (personkortHeaderProps: PersonkortHeaderProps) => {
  const fnr = useValgtPersonident();
  const { data: isEgenAnsatt } = useEgenansattQuery(fnr);
  const { navbruker, sykmeldinger } = personkortHeaderProps;
  const {
    data: { diskresjonskode },
    error,
  } = useAppSelector((state) => state.diskresjonskode);
  const hasCoronaDiagnose = sykmeldingerHasCoronaDiagnose(sykmeldinger);
  const visEtiketter =
    diskresjonskode === "6" ||
    diskresjonskode === "7" ||
    isEgenAnsatt ||
    hasCoronaDiagnose;

  const startDate = useStartDateFromLatestOppfolgingstilfellePeriode();

  return (
    <div className="personkortHeader">
      <div className="personkortHeader__info">
        <img
          src={
            hentBrukersKjoennFraFnr(navbruker.kontaktinfo.fnr) === KJOENN.KVINNE
              ? KvinneImage
              : MannImage
          }
          alt="person"
        />
        <div>
          <h3>{`${
            navbruker.navn ? navbruker.navn : ""
          } (${hentBrukersAlderFraFnr(navbruker.kontaktinfo.fnr)} år)`}</h3>
          <StyledFnr>
            {formaterFnr(navbruker.kontaktinfo.fnr)}
            <CopyButton
              message={texts.copied}
              value={navbruker.kontaktinfo.fnr}
            />
          </StyledFnr>
          <HeaderInfoStartDate startDate={startDate} />
        </div>
      </div>
      {visEtiketter && (
        <ErrorBoundary
          apiError={error}
          errorMessage={texts.fetchDiskresjonskodeFailed}
        >
          <div className="personkortHeader__etikker">
            {diskresjonskode === "6" && (
              <EtikettBase type="fokus">Kode 6</EtikettBase>
            )}
            {diskresjonskode === "7" && (
              <EtikettBase type="fokus">Kode 7</EtikettBase>
            )}
            {isEgenAnsatt && <EtikettBase type="fokus">Egenansatt</EtikettBase>}
            {hasCoronaDiagnose && (
              <EtikettBase type="fokus">Koronasykmeldt</EtikettBase>
            )}
          </div>
        </ErrorBoundary>
      )}
    </div>
  );
};

export default PersonkortHeader;
