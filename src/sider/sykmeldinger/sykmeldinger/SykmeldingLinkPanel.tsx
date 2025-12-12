import React, { ReactElement } from "react";
import { Link } from "react-router-dom";
import { tilLesbarPeriodeMedArstall } from "@/utils/datoUtils";
import { senesteTom, tidligsteFom } from "@/utils/periodeUtils";
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
import { ExclamationmarkTriangleIcon } from "@navikt/aksel-icons";

const texts = {
  teaserTekst: "Sykmelding\n",
  egenmeldtTeaserTekst: "Egenmeldt sykmelding\n",
  sendt: "Sendt til arbeidsgiver\n",
  utgaatt: "Ikke brukt på nett\n",
  tilSending: "Sender...",
  avbrutt: "Avbrutt av den sykmeldte\n",
  bekreftet: "Bekreftet av den sykmeldte\n",
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
    >
      <div className="flex gap-5">
        <div className="w-full">
          <div className="flex justify-between">
            {tilLesbarPeriodeMedArstall(
              tidligsteFom(sykmelding.mulighetForArbeid.perioder),
              senesteTom(sykmelding.mulighetForArbeid.perioder)
            )}
            <div className="flex gap-2 items-center">
              {visStatus && (
                <div className="flex gap-1 items-center">
                  {sykmelding.behandlingsutfall.status ===
                    BehandlingsutfallStatusDTO.INVALID && (
                    <ExclamationmarkTriangleIcon
                      title="advarsel-ikon"
                      fontSize="1.5rem"
                      color="var(--a-icon-danger)"
                    />
                  )}
                  <text>
                    {textStatus(sykmelding.status, behandlingsutfallStatus)}
                  </text>
                </div>
              )}
              {erViktigInformasjon && <ImportantInformationIcon />}
            </div>
          </div>
          <div className="flex mt-2">
            <Heading size="xsmall" className="flex mr-2">
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
