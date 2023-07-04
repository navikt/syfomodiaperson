import React, { ReactElement } from "react";
import { Link } from "react-router-dom";
import SykmeldingPeriodeInfo from "./SykmeldingPeriodeInfo";
import { tilLesbarPeriodeMedArstall } from "@/utils/datoUtils";
import { senesteTom, tidligsteFom } from "@/utils/periodeUtils";
import {
  ReportProblemTriangleImage,
  SykmeldingerImage,
} from "../../../../../img/ImageComponents";
import {
  SykmeldingOldFormat,
  SykmeldingPeriodeDTO,
  SykmeldingStatus,
} from "@/data/sykmelding/types/SykmeldingOldFormat";
import { BehandlingsutfallStatusDTO } from "@/data/sykmelding/types/BehandlingsutfallStatusDTO";
import { PapirsykmeldingTag } from "@/components/PapirsykmeldingTag";

const texts = {
  teaserTekst: "Sykmelding\n",
  egenmeldtTeaserTekst: "Egenmeldt sykmelding\n",
  sendt: "Sendt til arbeidsgiver\n",
  utgaatt: "Ikke brukt på nett\n",
  tilSending: "Sender...",
  avbrutt: "Avbrutt av deg\n",
  bekreftet: "Bekreftet av deg\n",
  avvist: "Avvist av NAV\n",
  papirLabelText: "Papir",
};

const textStatus = (
  status: SykmeldingStatus,
  behandlingsutfallStatus: BehandlingsutfallStatusDTO
) => {
  if (behandlingsutfallStatus === BehandlingsutfallStatusDTO.INVALID) {
    return texts.avvist;
  }
  switch (status) {
    case SykmeldingStatus.SENDT:
      return texts.sendt;
    case SykmeldingStatus.UTGAATT:
      return texts.utgaatt;
    case SykmeldingStatus.TIL_SENDING:
      return texts.tilSending;
    case SykmeldingStatus.AVBRUTT:
      return texts.avbrutt;
    case SykmeldingStatus.BEKREFTET:
      return texts.bekreftet;
    default:
      return "";
  }
};

interface PeriodeListeProps {
  perioder: SykmeldingPeriodeDTO[];
  arbeidsgiver?: string;
}

const PeriodeListe = ({ perioder, arbeidsgiver }: PeriodeListeProps) => {
  return (
    <ul className="teaser-punktliste js-perioder">
      {perioder.map((periode, index) => (
        <SykmeldingPeriodeInfo
          key={index}
          periode={periode}
          arbeidsgiver={arbeidsgiver}
          Element="li"
        />
      ))}
    </ul>
  );
};

const getIkon = (behandlingsutfallStatus: BehandlingsutfallStatusDTO) => {
  return behandlingsutfallStatus === BehandlingsutfallStatusDTO.INVALID
    ? ReportProblemTriangleImage
    : SykmeldingerImage;
};

interface SykmeldingTeaserProps {
  sykmelding: SykmeldingOldFormat;
}

const SykmeldingTeaser = ({
  sykmelding,
}: SykmeldingTeaserProps): ReactElement => {
  const behandlingsutfallStatus = sykmelding.behandlingsutfall.status;

  const antallPerioder = sykmelding.mulighetForArbeid.perioder.length;
  const visStatus =
    sykmelding.status !== SykmeldingStatus.NY ||
    behandlingsutfallStatus === BehandlingsutfallStatusDTO.INVALID;
  const showPapirLabel = !!sykmelding.papirsykmelding;

  return (
    <article aria-labelledby={`sykmelding-header-${sykmelding.id}`}>
      <Link
        className="inngangspanel inngangspanel--sykmelding"
        to={`/sykefravaer/sykmeldinger/${sykmelding.id}`}
      >
        <span className="inngangspanel__ikon">
          <img alt="" src={getIkon(behandlingsutfallStatus)} />
        </span>
        <div className="inngangspanel__innhold">
          <header className="inngangspanel__header">
            <h3 className="js-title" id={`sykmelding-header-${sykmelding.id}`}>
              <small className="inngangspanel__meta">
                {tilLesbarPeriodeMedArstall(
                  tidligsteFom(sykmelding.mulighetForArbeid.perioder),
                  senesteTom(sykmelding.mulighetForArbeid.perioder)
                )}
              </small>
              <span className="inngangspanel__tittel">
                {sykmelding.egenmeldt
                  ? texts.egenmeldtTeaserTekst
                  : texts.teaserTekst}
                {showPapirLabel && <PapirsykmeldingTag />}
              </span>
            </h3>
            {visStatus && (
              <p className="inngangspanel__status">
                {textStatus(sykmelding.status, behandlingsutfallStatus)}
              </p>
            )}
          </header>
          <div className="inngangspanel__tekst">
            {antallPerioder === 1 ? (
              <SykmeldingPeriodeInfo
                periode={sykmelding.mulighetForArbeid.perioder[0]}
                arbeidsgiver={sykmelding.innsendtArbeidsgivernavn}
              />
            ) : (
              <PeriodeListe
                perioder={sykmelding.mulighetForArbeid.perioder}
                arbeidsgiver={sykmelding.innsendtArbeidsgivernavn}
              />
            )}
          </div>
        </div>
      </Link>
    </article>
  );
};

export default SykmeldingTeaser;
