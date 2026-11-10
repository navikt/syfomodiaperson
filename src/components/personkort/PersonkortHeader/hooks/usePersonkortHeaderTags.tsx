import { ReactNode } from "react";
import { ArrowsCirclepathIcon } from "@navikt/aksel-icons";
import { useEgenansattQuery } from "@/data/egenansatt/egenansattQueryHooks";
import { useNavBrukerData } from "@/data/navbruker/navbruker_hooks";
import { useDiskresjonskodeQuery } from "@/data/diskresjonskode/diskresjonskodeQueryHooks";
import { formatNumericDate } from "@/utils/datoUtils";
import { useUnderArbeidsrettetOppfolgingQuery } from "@/data/veilarboppfolging/useUnderArbeidsrettetOppfolgingQuery";
import { useVedtakQuery } from "@/data/frisktilarbeid/vedtakQuery";
import { useUforegradQuery } from "@/data/uforegrad/uforegradQueryHooks";
import { useKontaktinfoQuery } from "@/data/navbruker/navbrukerQueryHooks";
import { useGetSykmeldingerQuery } from "@/data/sykmelding/useGetSykmeldingerQuery";
import {
  erAvvistSykmelding,
  erSykmeldingUtenArbeidsgiver,
  sykmeldingerSortertNyestTilEldstPeriode,
  SykmeldingStatus,
} from "@/data/sykmelding/types/SykmeldingOldFormat";
import { useOppfolgingstilfellePersonQuery } from "@/data/oppfolgingstilfelle/person/oppfolgingstilfellePersonQueryHooks.ts";
import { useAapStatusQuery } from "@/data/aap/aapQueryHooks.ts";
import { getAapTagText } from "@/components/personkort/PersonkortHeader/utils/aapTagText.ts";

const texts = {
  dod: "Død",
  kode6: "Kode 6",
  kode7: "Kode 7",
  egenansatt: "Egenansatt",
  gjentakendeSykefravar: "Gjentakende sykefravær",
  talesprakTolk: "Talespråktolk",
  tegnsprakTolk: "Tegnspråktolk",
  sikkerhetstiltak: "Sikkerhetstiltak",
  ao: "Under arbeidsrettet oppfølging",
  friskmeldingTilArbeidsformidling: "Vedtak § 8-5",
  uforegrad: (uforegrad: number) => `Ufør ${uforegrad} %`,
  reservertKRR: "Reservert KRR",
  harIkkeArbeidsgiver: "Uten arbeidsgiver",
  underVergemal: "Under vergemål",
};

/**
 * En tag som vises i headeren på personkortet.
 */
export interface PersonkortTag {
  key: string;
  label: string;
  color: "warning" | "info" | "danger";
  icon?: ReactNode;
}

interface PersonkortTagCandidate extends PersonkortTag {
  isVisible: boolean;
}

/**
 * Finner hvilke tags som skal vises i headeren på personkortet, i den rekkefølgen de skal vises.
 *
 * @returns tags som skal vises, og eventuell feil ved henting av diskresjonskode.
 */
export function usePersonkortHeaderTags(): {
  tags: PersonkortTag[];
  diskresjonskodeError: Error | null;
} {
  const { data: isEgenAnsatt } = useEgenansattQuery();
  const {
    dodsdato,
    sikkerhetstiltak,
    underVergemal,
    tilrettelagtKommunikasjon,
  } = useNavBrukerData();
  const { error: diskresjonskodeError, data: diskresjonskode } =
    useDiskresjonskodeQuery();
  const { data: arbeidsrettetOppfolging } =
    useUnderArbeidsrettetOppfolgingQuery();
  const { data: vedtakFriskTilArbeid } = useVedtakQuery();
  const { data: uforegradData } = useUforegradQuery();
  const { brukerKanIkkeVarslesDigitalt } = useKontaktinfoQuery();
  const getSykmeldingerQuery = useGetSykmeldingerQuery();
  const { hasGjentakendeSykefravar } = useOppfolgingstilfellePersonQuery();
  const { data: aapStatus } = useAapStatusQuery();

  const talesprakTolkSprakkode =
    tilrettelagtKommunikasjon?.talesprakTolk?.value;
  const tegnsprakTolkSprakkode =
    tilrettelagtKommunikasjon?.tegnsprakTolk?.value;
  const hasActiveFriskmeldingVedtak =
    !!vedtakFriskTilArbeid[0] &&
    new Date(vedtakFriskTilArbeid[0].tom).getTime() >= new Date().getTime();
  const aapTagText = aapStatus ? getAapTagText(aapStatus) : undefined;

  const nyligsteSendtEllerBekreftetSykmelding =
    sykmeldingerSortertNyestTilEldstPeriode(
      getSykmeldingerQuery.sykmeldinger,
    ).find(
      (sykmelding) =>
        !erAvvistSykmelding(sykmelding) &&
        (sykmelding.status === SykmeldingStatus.SENDT ||
          sykmelding.status === SykmeldingStatus.BEKREFTET),
    );
  const harIkkeArbeidsgiver = nyligsteSendtEllerBekreftetSykmelding
    ? erSykmeldingUtenArbeidsgiver(nyligsteSendtEllerBekreftetSykmelding)
    : false;

  const candidates: PersonkortTagCandidate[] = [
    {
      key: "kode6",
      label: texts.kode6,
      color: "warning",
      isVisible: diskresjonskode === "6",
    },
    {
      key: "kode7",
      label: texts.kode7,
      color: "warning",
      isVisible: diskresjonskode === "7",
    },
    {
      key: "egenansatt",
      label: texts.egenansatt,
      color: "warning",
      isVisible: !!isEgenAnsatt,
    },
    {
      key: "gjentakendeSykefravar",
      label: texts.gjentakendeSykefravar,
      color: "warning",
      icon: <ArrowsCirclepathIcon aria-hidden />,
      isVisible: hasGjentakendeSykefravar,
    },
    {
      key: "arbeidsrettetOppfolging",
      label: texts.ao,
      color: "info",
      isVisible: !!arbeidsrettetOppfolging?.underOppfolging,
    },
    {
      key: "friskmeldingTilArbeidsformidling",
      label: texts.friskmeldingTilArbeidsformidling,
      color: "info",
      isVisible: hasActiveFriskmeldingVedtak,
    },
    {
      key: "uforegrad",
      label: texts.uforegrad(uforegradData?.uforegrad ?? 0),
      color: "info",
      isVisible: !!uforegradData?.uforegrad,
    },
    {
      key: "talesprakTolk",
      label: `${texts.talesprakTolk}: ${talesprakTolkSprakkode}`,
      color: "warning",
      isVisible: !!talesprakTolkSprakkode,
    },
    {
      key: "tegnsprakTolk",
      label: `${texts.tegnsprakTolk}: ${tegnsprakTolkSprakkode}`,
      color: "warning",
      isVisible: !!tegnsprakTolkSprakkode,
    },
    {
      key: "dod",
      label: `${texts.dod} ${formatNumericDate(dodsdato)}`,
      color: "danger",
      isVisible: !!dodsdato,
    },
    ...sikkerhetstiltak.map(
      ({ beskrivelse }, index): PersonkortTagCandidate => ({
        key: `sikkerhetstiltak-${index}`,
        label: `${texts.sikkerhetstiltak}: ${beskrivelse}`,
        color: "danger",
        isVisible: true,
      }),
    ),
    {
      key: "reservertKRR",
      label: texts.reservertKRR,
      color: "warning",
      isVisible: brukerKanIkkeVarslesDigitalt,
    },
    {
      key: "harIkkeArbeidsgiver",
      label: texts.harIkkeArbeidsgiver,
      color: "warning",
      isVisible: harIkkeArbeidsgiver,
    },
    {
      key: "aap",
      label: aapTagText ?? "",
      color: "info",
      isVisible: !!aapTagText,
    },
    {
      key: "underVergemal",
      label: texts.underVergemal,
      color: "warning",
      isVisible: !!underVergemal,
    },
  ];

  const tags = candidates
    .filter(({ isVisible }) => isVisible)
    .map(({ key, label, color, icon }) => ({ key, label, color, icon }));

  return { tags, diskresjonskodeError };
}
