import React from "react";
import {
  isArbeidstakerMotebehov,
  getUbehandletSvarOgMeldtBehov,
  sorterMotebehovDataEtterDato,
  getMotebehovInActiveTilfelle,
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

export const setSvarTekst = (
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

const ikonAlternativTekst = (deltakerOnskerMote?: boolean) => {
  switch (deltakerOnskerMote) {
    case true: {
      return "Svart ja.";
    }
    case false: {
      return "Svart nei.";
    }
    default: {
      return "Ikke svart.";
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
  const svarResultat = setSvarTekst(skjemaType, harMotebehov);
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

  const arbeidstakerTekst = composePersonSvarText(
    "Den sykmeldte: ",
    skjemaType ?? arbeidstakersMotebehov?.skjemaType ?? null,
    sykmeldt?.navn ? capitalizeAllWords(sykmeldt.navn) : sykmeldt?.navn,
    arbeidstakerOnskerMote,
    arbeidstakersMotebehov?.opprettetDato
  );

  const ikonAltTekst = `Sykmeldt ${ikonAlternativTekst(
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
  motebehov: MotebehovVeilederDTO | undefined;
  skjemaType?: MotebehovSkjemaType | null;
}) {
  const arbeidsgiverOnskerMote = motebehov?.motebehovSvar?.harMotebehov;
  const ikonAltTekst = `Arbeidsgiver ${arbeidsgiverNavnEllerTomStreng(
    motebehov?.opprettetAvNavn ?? null
  )} ${ikonAlternativTekst(arbeidsgiverOnskerMote)}`;

  return (
    <MotebehovKvitteringInnhold
      deltakerOnskerMote={arbeidsgiverOnskerMote}
      ikonAltTekst={ikonAltTekst}
      motebehov={motebehov}
      tekst={composeArbeidsgiverSvarText(
        motebehov?.opprettetAvNavn ?? null,
        skjemaType ?? motebehov?.skjemaType ?? null,
        arbeidsgiverOnskerMote,
        motebehov?.opprettetDato
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
        )} ${ikonAlternativTekst(undefined)}`;
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

  function findSkjemaType(motebehov: MotebehovVeilederDTO | undefined) {
    if (motebehovArbeidstaker && motebehovArbeidsgiver) {
      return motebehov?.skjemaType;
    } else if (motebehovArbeidstaker && !motebehovArbeidsgiver) {
      return motebehovArbeidstaker?.skjemaType;
    } else if (motebehovArbeidsgiver && !motebehovArbeidstaker) {
      return motebehovArbeidsgiver?.skjemaType;
    } else {
      return undefined;
    }
  }

  return (
    <div>
      <MotebehovKvitteringInnholdArbeidstaker
        arbeidstakersMotebehov={motebehovArbeidstaker}
        skjemaType={findSkjemaType(motebehovArbeidstaker) ?? null}
      />
      <MotebehovArbeidsgiverInCurrentTilfelle
        motebehov={motebehovArbeidsgiver}
        oppfolgingstilfelle={oppfolgingstilfelle}
        skjemaType={findSkjemaType(motebehovArbeidstaker) ?? null}
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
  sorterteMotebehov,
}: {
  sorterteMotebehov: MotebehovVeilederDTO[];
}) {
  const ubehandledeEldreMotebehov =
    getUbehandletSvarOgMeldtBehov(sorterteMotebehov);
  const motebehovArbeidstaker = ubehandledeEldreMotebehov.find(
    isArbeidstakerMotebehov
  );
  const motebehovArbeidsgiver = ubehandledeEldreMotebehov.find(
    (motebehov) => !isArbeidstakerMotebehov(motebehov)
  );

  return (
    <div>
      {(motebehovArbeidstaker || motebehovArbeidsgiver) && (
        <BodyShort>
          Ubehandlede møtebehov fra tidligere oppfølgingstilfelle
        </BodyShort>
      )}
      {motebehovArbeidstaker && (
        <MotebehovKvitteringInnholdArbeidstaker
          arbeidstakersMotebehov={motebehovArbeidstaker}
          skjemaType={motebehovArbeidstaker?.skjemaType ?? null}
        />
      )}
      {motebehovArbeidsgiver && (
        <MotebehovArbeidsgiverKvittering
          motebehov={motebehovArbeidsgiver}
          skjemaType={motebehovArbeidsgiver?.skjemaType ?? null}
        />
      )}
    </div>
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

  return motebehovInActiveTilfelle.length > 0 && latestOppfolgingstilfelle ? (
    <MotebehovInCurrentTilfelle
      motebehovInTilfelle={motebehovInActiveTilfelle}
      oppfolgingstilfelle={latestOppfolgingstilfelle}
    />
  ) : (
    <UbehandledeMotebehovUtenforTilfelle sorterteMotebehov={sortertMotebehov} />
  );
}
