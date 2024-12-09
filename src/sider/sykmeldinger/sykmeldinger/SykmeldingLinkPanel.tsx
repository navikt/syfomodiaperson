import React, { ReactElement, useState } from "react";
import { Link } from "react-router-dom";
import { tilLesbarPeriodeMedArstall } from "@/utils/datoUtils";
import { senesteTom, tidligsteFom } from "@/utils/periodeUtils";
import {
  ReportProblemTriangleImage,
  SykmeldingerHoverBlaaImage,
  SykmeldingerImage,
} from "../../../../img/ImageComponents";
import {
  SykmeldingOldFormat,
  SykmeldingPeriodeDTO,
  SykmeldingStatus,
} from "@/data/sykmelding/types/SykmeldingOldFormat";
import { BehandlingsutfallStatusDTO } from "@/data/sykmelding/types/BehandlingsutfallStatusDTO";
import { Heading, LinkPanel, List } from "@navikt/ds-react";
import styled from "styled-components";
import { PapirsykmeldingTag } from "@/components/PapirsykmeldingTag";
import { erEkstraInformasjonISykmeldingen } from "@/utils/sykmeldinger/sykmeldingUtils";
import ImportantInformationIcon from "@/components/ImportantInformationIcon";
import { sykmeldingPeriodeTekst } from "@/sider/sykmeldinger/sykmeldinger/SykmeldingPeriodeInfo";
import { UtenlandskSykmeldingTag } from "@/components/UtenlandskSykmeldingTag";

const texts = {
  teaserTekst: "Sykmelding\n",
  egenmeldtTeaserTekst: "Egenmeldt sykmelding\n",
  sendt: "Sendt til arbeidsgiver\n",
  utgaatt: "Ikke brukt på nett\n",
  tilSending: "Sender...",
  avbrutt: "Avbrutt av deg\n",
  bekreftet: "Bekreftet av deg\n",
  avvist: "Avvist av Nav\n",
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

export function PeriodeListe({ perioder, arbeidsgiver }: PeriodeListeProps) {
  return (
    <List as="ul" size="small">
      {perioder.map((periode, index) => (
        <List.Item key={index}>
          {sykmeldingPeriodeTekst(periode, arbeidsgiver)}
        </List.Item>
      ))}
    </List>
  );
}

const getIkon = (behandlingsutfallStatus: BehandlingsutfallStatusDTO) => {
  return behandlingsutfallStatus === BehandlingsutfallStatusDTO.INVALID
    ? ReportProblemTriangleImage
    : SykmeldingerImage;
};

const getHoverIkon = (behandlingsutfallStatus: BehandlingsutfallStatusDTO) => {
  return behandlingsutfallStatus === BehandlingsutfallStatusDTO.INVALID
    ? ReportProblemTriangleImage
    : SykmeldingerHoverBlaaImage;
};

const StyledLinkPanel = styled(LinkPanel)`
  margin-bottom: 0.1em;

  .navds-link-panel__content {
    width: 100%;
  }
`;

interface Props {
  sykmelding: SykmeldingOldFormat;
}

export default function SykmeldingLinkPanel({
  sykmelding,
}: Props): ReactElement {
  const behandlingsutfallStatus = sykmelding.behandlingsutfall.status;
  const [ikon, setIkon] = useState(getIkon(behandlingsutfallStatus));

  const visStatus =
    sykmelding.status !== SykmeldingStatus.NY ||
    behandlingsutfallStatus === BehandlingsutfallStatusDTO.INVALID;
  const showPapirLabel = !!sykmelding.papirsykmelding;
  const showUtenlandskLabel = sykmelding.utenlandskSykmelding != null;
  const erViktigInformasjon = erEkstraInformasjonISykmeldingen(sykmelding);

  return (
    <StyledLinkPanel
      forwardedAs={Link}
      to={`/sykefravaer/sykmeldinger/${sykmelding.id}`}
      border={false}
      onMouseEnter={() => {
        setIkon(getHoverIkon(behandlingsutfallStatus));
      }}
      onMouseLeave={() => {
        setIkon(getIkon(behandlingsutfallStatus));
      }}
    >
      <div className="flex gap-4">
        <img src={ikon} alt="Plaster-ikon" className="self-start" />
        <div className="w-full">
          <div className="flex justify-between">
            {tilLesbarPeriodeMedArstall(
              tidligsteFom(sykmelding.mulighetForArbeid.perioder),
              senesteTom(sykmelding.mulighetForArbeid.perioder)
            )}
            <div className="flex gap-2 items-center">
              {visStatus && (
                <text>
                  {textStatus(sykmelding.status, behandlingsutfallStatus)}
                </text>
              )}
              {erViktigInformasjon && <ImportantInformationIcon />}
            </div>
          </div>
          <div className="flex">
            <Heading size="small" className="flex mr-2">
              {sykmelding.egenmeldt
                ? texts.egenmeldtTeaserTekst
                : texts.teaserTekst}
            </Heading>
            {showPapirLabel && <PapirsykmeldingTag />}
            {showUtenlandskLabel && <UtenlandskSykmeldingTag />}
          </div>
          <PeriodeListe
            perioder={sykmelding.mulighetForArbeid.perioder}
            arbeidsgiver={sykmelding.innsendtArbeidsgivernavn}
          />
        </div>
      </div>
    </StyledLinkPanel>
  );
}
