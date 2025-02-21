import React from "react";
import {
  getMotebehovInActiveTilfelle,
  isArbeidstakerMotebehov,
  motebehovUbehandlet,
  sorterMotebehovDataEtterDato,
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
import { OppfolgingstilfelleDTO } from "@/data/oppfolgingstilfelle/person/types/OppfolgingstilfellePersonDTO";
import { activeNarmesteLederForCurrentOppfolgingstilfelle } from "@/sider/oppfolgingsplan/oppfolgingsplaner/AktiveOppfolgingsplaner";
import { BodyShort } from "@navikt/ds-react";

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
    arbeidstakersMotebehov?.motebehovSvar?.harMotebehov;
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
  lederNavn: string | null,
  skjemaType: MotebehovSkjemaType | null,
  harMotebehov?: boolean,
  svarOpprettetDato?: Date
) => {
  return composePersonSvarText(
    "Nærmeste leder: ",
    skjemaType,
    arbeidsgiverNavnEllerTomStreng(capitalizeAllWords(lederNavn || "")),
    harMotebehov,
    svarOpprettetDato
  );
};

export function MotebehovArbeidsgiverKvittering({
  motebehov,
  skjemaType,
}: {
  motebehov: MotebehovVeilederDTO;
  skjemaType?: MotebehovSkjemaType | null;
}) {
  const arbeidsgiverOnskerMote = motebehov.motebehovSvar.harMotebehov;
  const skjemaTypeMotebehov = skjemaType ?? motebehov.skjemaType;
  const ikonAltTekst = `Arbeidsgiver ${arbeidsgiverNavnEllerTomStreng(
    motebehov.opprettetAvNavn
  )} ${ikonAlternativTekst(skjemaTypeMotebehov, arbeidsgiverOnskerMote)}`;

  return (
    <MotebehovKvitteringInnhold
      deltakerOnskerMote={arbeidsgiverOnskerMote}
      ikonAltTekst={ikonAltTekst}
      motebehov={motebehov}
      tekst={composeArbeidsgiverSvarText(
        motebehov.opprettetAvNavn,
        skjemaTypeMotebehov,
        arbeidsgiverOnskerMote,
        motebehov.opprettetDato
      )}
    />
  );
}

interface MotebehovKvitteringInnholdArbeidsgiverUtenMotebehovProps {
  ledereUtenInnsendtMotebehov: NarmesteLederRelasjonDTO[];
  skjemaType: MotebehovSkjemaType | null;
}

export const MotebehovKvitteringInnholdArbeidsgiverUtenMotebehov = ({
  ledereUtenInnsendtMotebehov,
  skjemaType,
}: MotebehovKvitteringInnholdArbeidsgiverUtenMotebehovProps) => (
  <>
    {ledereUtenInnsendtMotebehov.map(
      (leder: NarmesteLederRelasjonDTO, index: number) => {
        const ikonAltTekst = `Arbeidsgiver ${arbeidsgiverNavnEllerTomStreng(
          leder.narmesteLederNavn
        )} ${ikonAlternativTekst(skjemaType)}`;
        return (
          <MotebehovKvitteringInnhold
            key={index}
            ikonAltTekst={ikonAltTekst}
            tekst={composeArbeidsgiverSvarText(
              leder.narmesteLederNavn,
              skjemaType
            )}
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
    <div className="flex flex-col gap-2">
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
  const { currentLedere } = useLedereQuery();
  const ledereInCurrentTilfelle =
    activeNarmesteLederForCurrentOppfolgingstilfelle(
      currentLedere,
      oppfolgingstilfelle
    );

  return motebehov ? (
    <MotebehovArbeidsgiverKvittering
      motebehov={motebehov}
      skjemaType={motebehov?.skjemaType ?? null}
    />
  ) : (
    <MotebehovKvitteringInnholdArbeidsgiverUtenMotebehov
      ledereUtenInnsendtMotebehov={ledereInCurrentTilfelle}
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

  const harUbehandledeMotebehov = !!(
    ubehandletMotebehovArbeidstaker || ubehandletMotebehovArbeidsgiver
  );

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

  const sortertMotebehov = motebehov.sort(sorterMotebehovDataEtterDato);
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
