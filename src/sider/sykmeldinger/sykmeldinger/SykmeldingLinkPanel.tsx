import { ReactElement } from "react";
import { Link } from "react-router-dom";
import { formatDateRangeWithYear } from "@/utils/datoUtils";
import { senesteTom, tidligsteFom } from "@/utils/periodeUtils";
import {
  SykmeldingOldFormat,
  SykmeldingPeriodeDTO,
  SykmeldingStatus,
} from "@/data/sykmelding/types/SykmeldingOldFormat";
import { BehandlingsutfallStatusDTO } from "@/data/sykmelding/types/BehandlingsutfallStatusDTO";
import { Box, LinkCard, List } from "@navikt/ds-react";
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
  behandlingsutfallStatus: BehandlingsutfallStatusDTO,
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
    <Box marginBlock="space-12" asChild>
      <List as="ul" size="small">
        {perioder.map((periode, index) => (
          <List.Item key={index}>
            {sykmeldingPeriodeTekst(periode, arbeidsgiver)}
          </List.Item>
        ))}
      </List>
    </Box>
  );
}

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
    <LinkCard size="small">
      <LinkCard.Title>
        <LinkCard.Anchor asChild>
          <Link to={`/sykefravaer/sykmeldinger/${sykmelding.id}`}>
            {sykmelding.egenmeldt
              ? texts.egenmeldtTeaserTekst
              : texts.teaserTekst}
          </Link>
        </LinkCard.Anchor>
      </LinkCard.Title>
      <LinkCard.Description>
        <div className="flex justify-between">
          {formatDateRangeWithYear(
            tidligsteFom(sykmelding.mulighetForArbeid.perioder),
            senesteTom(sykmelding.mulighetForArbeid.perioder),
          )}
          <div className="flex gap-2 items-center">
            {visStatus && (
              <div className="flex gap-1 items-center">
                {sykmelding.behandlingsutfall.status ===
                  BehandlingsutfallStatusDTO.INVALID && (
                  <ExclamationmarkTriangleIcon
                    title="advarsel-ikon"
                    fontSize="1.5rem"
                    color="var(--ax-text-danger-decoration)"
                  />
                )}
                <span>
                  {textStatus(sykmelding.status, behandlingsutfallStatus)}
                </span>
              </div>
            )}
            {erViktigInformasjon && <ImportantInformationIcon />}
          </div>
        </div>
        <PeriodeListe
          perioder={sykmelding.mulighetForArbeid.perioder}
          arbeidsgiver={sykmelding.innsendtArbeidsgivernavn}
        />
      </LinkCard.Description>
      {(showPapirLabel || showUtenlandskLabel) && (
        <LinkCard.Footer>
          {showPapirLabel && <PapirsykmeldingTag />}
          {showUtenlandskLabel && <UtenlandskSykmeldingTag />}
        </LinkCard.Footer>
      )}
    </LinkCard>
  );
}
