import React from "react";
import {
  arbeidsgiverNavnMedVirksomhet,
  getMotebehovInActiveTilfelle,
  isArbeidstakerMotebehov,
  motebehovUbehandlet,
  sorterMotebehovDataEtterDatoDesc,
} from "@/utils/motebehovUtils";
import { tilLesbarDatoMedArUtenManedNavn } from "@/utils/datoUtils";
import {
  MotebehovSkjemaType,
  MotebehovVeilederDTO,
} from "@/data/motebehov/types/motebehovTypes";
import { useOppfolgingstilfellePersonQuery } from "@/data/oppfolgingstilfelle/person/oppfolgingstilfellePersonQueryHooks";
import { NarmesteLederRelasjonDTO } from "@/data/leder/ledereTypes";
import { capitalizeAllWords } from "@/utils/stringUtils";
import MotebehovKvitteringInnhold from "@/sider/dialogmoter/motebehov/MotebehovKvitteringInnhold";
import { useNavBrukerData } from "@/data/navbruker/navbruker_hooks";
import { useMotebehovQuery } from "@/data/motebehov/motebehovQueryHooks";
import { useLedereQuery } from "@/data/leder/ledereQueryHooks";
import {
  aktiveNarmesteLedereForOppfolgingstilfelle,
  OppfolgingstilfelleDTO,
} from "@/data/oppfolgingstilfelle/person/types/OppfolgingstilfellePersonDTO";
import { BodyShort } from "@navikt/ds-react";
import { useVirksomhetQuery } from "@/data/virksomhet/virksomhetQueryHooks.ts";

export const arbeidsgiverNavnEllerTomStreng = (lederNavn: string | null) => {
  return lederNavn ? `${lederNavn}` : "";
};

export const getSvarTekst = (
  skjemaType: MotebehovSkjemaType | null,
  deltakerOnskerMote?: boolean
) => {
  switch (deltakerOnskerMote) {
    case true: {
      return skjemaType === MotebehovSkjemaType.SVAR_BEHOV
        ? " har svart JA"
        : " har meldt behov";
    }
    case false: {
      return " har svart NEI";
    }
    default: {
      return skjemaType === MotebehovSkjemaType.SVAR_BEHOV
        ? " har ikke svart"
        : " har ikke meldt behov";
    }
  }
};

const ikonAlternativTekst = (
  skjemaType: MotebehovSkjemaType | null,
  deltakerOnskerMote?: boolean
) => {
  switch (deltakerOnskerMote) {
    case true: {
      return skjemaType === MotebehovSkjemaType.SVAR_BEHOV
        ? "Svart ja."
        : "Meldt behov.";
    }
    case false: {
      return "Svart nei.";
    }
    default: {
      return skjemaType === MotebehovSkjemaType.SVAR_BEHOV
        ? "Ikke svart."
        : "Ikke meldt behov.";
    }
  }
};

const composePersonSvarText = (
  personIngress: string,
  skjemaType: MotebehovSkjemaType | null,
  personNavn?: string,
  harMotebehov?: boolean,
  svarOpprettetDato?: Date
) => {
  const svarResultat = getSvarTekst(skjemaType, harMotebehov);
  const opprettetDato = svarOpprettetDato
    ? " - " + tilLesbarDatoMedArUtenManedNavn(svarOpprettetDato)
    : undefined;

  return (
    <span>
      <b>{personIngress}</b> {personNavn}, {svarResultat} {opprettetDato}
    </span>
  );
};

interface MotebehovKvitteringInnholdArbeidstakerProps {
  arbeidstakersMotebehov: MotebehovVeilederDTO | undefined;
  skjemaType?: MotebehovSkjemaType | null;
}

export const MotebehovKvitteringInnholdArbeidstaker = ({
  arbeidstakersMotebehov,
  skjemaType,
}: MotebehovKvitteringInnholdArbeidstakerProps) => {
  const sykmeldt = useNavBrukerData();
  const arbeidstakerOnskerMote =
    arbeidstakersMotebehov?.formValues.harMotebehov;
  const skjemaTypeMotebehov =
    skjemaType ?? arbeidstakersMotebehov?.skjemaType ?? null;

  const arbeidstakerTekst = composePersonSvarText(
    "Den sykmeldte: ",
    skjemaTypeMotebehov,
    sykmeldt?.navn ? capitalizeAllWords(sykmeldt.navn) : sykmeldt?.navn,
    arbeidstakerOnskerMote,
    arbeidstakersMotebehov?.opprettetDato
  );

  const ikonAltTekst = `Sykmeldt ${ikonAlternativTekst(
    skjemaTypeMotebehov,
    arbeidstakerOnskerMote
  )}`;

  return (
    <MotebehovKvitteringInnhold
      deltakerOnskerMote={arbeidstakerOnskerMote}
      ikonAltTekst={ikonAltTekst}
      motebehov={arbeidstakersMotebehov}
      tekst={arbeidstakerTekst}
    />
  );
};

export const composeArbeidsgiverSvarText = (
  arbeidsgiverInfo: string | null,
  skjemaType: MotebehovSkjemaType | null,
  harMotebehov?: boolean,
  svarOpprettetDato?: Date
) => {
  return composePersonSvarText(
    "Nærmeste leder: ",
    skjemaType,
    arbeidsgiverInfo || "",
    harMotebehov,
    svarOpprettetDato
  );
};

export function MotebehovArbeidsgiverKvittering({
  motebehov,
  skjemaType,
  virksomhet,
}: {
  motebehov: MotebehovVeilederDTO;
  skjemaType?: MotebehovSkjemaType | null;
  virksomhet?: string;
}) {
  const arbeidsgiverOnskerMote = motebehov.formValues.harMotebehov;
  const skjemaTypeMotebehov = skjemaType ?? motebehov.skjemaType;
  const arbeidsgiverInfo = arbeidsgiverNavnMedVirksomhet(
    motebehov.opprettetAvNavn,
    virksomhet
  );
  const ikonAltTekst = `Arbeidsgiver ${arbeidsgiverInfo} ${ikonAlternativTekst(
    skjemaTypeMotebehov,
    arbeidsgiverOnskerMote
  )}`;

  return (
    <MotebehovKvitteringInnhold
      deltakerOnskerMote={arbeidsgiverOnskerMote}
      ikonAltTekst={ikonAltTekst}
      motebehov={motebehov}
      tekst={composeArbeidsgiverSvarText(
        arbeidsgiverInfo,
        skjemaTypeMotebehov,
        arbeidsgiverOnskerMote,
        motebehov.opprettetDato
      )}
    />
  );
}

interface MotebehovKvitteringInnholdArbeidsgiverUtenMotebehovProps {
  ledereInCurrentTilfelle: NarmesteLederRelasjonDTO[];
  skjemaType: MotebehovSkjemaType | null;
}

export const MotebehovKvitteringInnholdArbeidsgiverUtenMotebehov = ({
  ledereInCurrentTilfelle,
  skjemaType,
}: MotebehovKvitteringInnholdArbeidsgiverUtenMotebehovProps) => (
  <>
    {ledereInCurrentTilfelle.map(
      (leder: NarmesteLederRelasjonDTO, index: number) => {
        const arbeidsgiverInfo = arbeidsgiverNavnMedVirksomhet(
          leder.narmesteLederNavn,
          leder.virksomhetsnavn || leder.virksomhetsnummer
        );
        const ikonAltTekst = `Arbeidsgiver ${arbeidsgiverInfo} ${ikonAlternativTekst(
          skjemaType
        )}`;
        return (
          <MotebehovKvitteringInnhold
            key={index}
            ikonAltTekst={ikonAltTekst}
            tekst={composeArbeidsgiverSvarText(arbeidsgiverInfo, skjemaType)}
          />
        );
      }
    )}
  </>
);

function MotebehovInCurrentTilfelle({
  motebehovInTilfelle,
  oppfolgingstilfelle,
}: {
  motebehovInTilfelle: MotebehovVeilederDTO[];
  oppfolgingstilfelle: OppfolgingstilfelleDTO;
}) {
  const motebehovArbeidstaker = motebehovInTilfelle.find(
    isArbeidstakerMotebehov
  );
  const motebehovArbeidsgiver = motebehovInTilfelle.find(
    (motebehov) => !isArbeidstakerMotebehov(motebehov)
  );

  function findSkjemaType(
    motebehov: MotebehovVeilederDTO | undefined
  ): MotebehovSkjemaType | null {
    if (motebehovArbeidstaker && motebehovArbeidsgiver) {
      return motebehov?.skjemaType ?? null;
    } else if (motebehovArbeidstaker && !motebehovArbeidsgiver) {
      return motebehovArbeidstaker?.skjemaType;
    } else if (motebehovArbeidsgiver && !motebehovArbeidstaker) {
      return motebehovArbeidsgiver?.skjemaType;
    } else {
      return null;
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <MotebehovKvitteringInnholdArbeidstaker
        arbeidstakersMotebehov={motebehovArbeidstaker}
        skjemaType={findSkjemaType(motebehovArbeidstaker)}
      />
      <MotebehovArbeidsgiverInCurrentTilfelle
        motebehov={motebehovArbeidsgiver}
        oppfolgingstilfelle={oppfolgingstilfelle}
        skjemaType={findSkjemaType(motebehovArbeidstaker)}
      />
    </div>
  );
}

function MotebehovArbeidsgiverInCurrentTilfelle({
  motebehov,
  oppfolgingstilfelle,
  skjemaType,
}: {
  motebehov: MotebehovVeilederDTO | undefined;
  oppfolgingstilfelle: OppfolgingstilfelleDTO;
  skjemaType: MotebehovSkjemaType | null;
}) {
  const { virksomhetsnavn } = useVirksomhetQuery(motebehov?.virksomhetsnummer);
  const virksomhet = virksomhetsnavn || motebehov?.virksomhetsnummer;

  const { currentLedere } = useLedereQuery();
  const ledereInCurrentTilfelle = aktiveNarmesteLedereForOppfolgingstilfelle(
    currentLedere,
    oppfolgingstilfelle
  );

  return motebehov ? (
    <MotebehovArbeidsgiverKvittering
      motebehov={motebehov}
      skjemaType={motebehov?.skjemaType ?? null}
      virksomhet={virksomhet}
    />
  ) : (
    <MotebehovKvitteringInnholdArbeidsgiverUtenMotebehov
      ledereInCurrentTilfelle={ledereInCurrentTilfelle}
      skjemaType={skjemaType}
    />
  );
}

function UbehandledeMotebehovUtenforTilfelle({
  sorterteMotebehovUtenforTilfelle,
}: {
  sorterteMotebehovUtenforTilfelle: MotebehovVeilederDTO[];
}) {
  const ubehandledeEldreMotebehov = motebehovUbehandlet(
    sorterteMotebehovUtenforTilfelle
  );
  const ubehandletMotebehovArbeidstaker = ubehandledeEldreMotebehov.find(
    isArbeidstakerMotebehov
  );
  const ubehandletMotebehovArbeidsgiver = ubehandledeEldreMotebehov.find(
    (motebehov) => !isArbeidstakerMotebehov(motebehov)
  );
  const { virksomhetsnavn } = useVirksomhetQuery(
    ubehandletMotebehovArbeidsgiver?.virksomhetsnummer
  );

  const harUbehandledeMotebehov = !!(
    ubehandletMotebehovArbeidstaker || ubehandletMotebehovArbeidsgiver
  );

  const virksomhet =
    virksomhetsnavn || ubehandletMotebehovArbeidsgiver?.virksomhetsnummer;

  return harUbehandledeMotebehov ? (
    <div className="flex flex-col gap-2">
      <BodyShort size="small">
        Ubehandlede møtebehov fra tidligere oppfølgingstilfelle:
      </BodyShort>
      {ubehandletMotebehovArbeidstaker && (
        <MotebehovKvitteringInnholdArbeidstaker
          arbeidstakersMotebehov={ubehandletMotebehovArbeidstaker}
          skjemaType={ubehandletMotebehovArbeidstaker?.skjemaType ?? null}
        />
      )}
      {ubehandletMotebehovArbeidsgiver && (
        <MotebehovArbeidsgiverKvittering
          motebehov={ubehandletMotebehovArbeidsgiver}
          skjemaType={ubehandletMotebehovArbeidsgiver?.skjemaType ?? null}
          virksomhet={virksomhet}
        />
      )}
    </div>
  ) : (
    <BodyShort size="small">
      Alle tidligere møtebehov er behandlet, se møtebehovhistorikken for flere
      detaljer.
    </BodyShort>
  );
}

export default function MotebehovKvittering() {
  const { data: motebehov } = useMotebehovQuery();
  const { latestOppfolgingstilfelle } = useOppfolgingstilfellePersonQuery();

  const sortertMotebehov = motebehov.sort(sorterMotebehovDataEtterDatoDesc);
  const motebehovInActiveTilfelle = getMotebehovInActiveTilfelle(
    sortertMotebehov,
    latestOppfolgingstilfelle
  );
  const harMotebehovInTilfelle = !!(
    motebehovInActiveTilfelle.length > 0 && latestOppfolgingstilfelle
  );

  return sortertMotebehov.length === 0 ? (
    <BodyShort>Ingen tidligere møtebehov</BodyShort>
  ) : harMotebehovInTilfelle ? (
    <MotebehovInCurrentTilfelle
      motebehovInTilfelle={motebehovInActiveTilfelle}
      oppfolgingstilfelle={latestOppfolgingstilfelle}
    />
  ) : (
    <UbehandledeMotebehovUtenforTilfelle
      sorterteMotebehovUtenforTilfelle={sortertMotebehov}
    />
  );
}
