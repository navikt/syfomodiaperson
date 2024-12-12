import React from "react";
import {
  finnArbeidstakerMotebehovSvar,
  motebehovFromLatestActiveTilfelle,
  sorterMotebehovDataEtterDato,
} from "@/utils/motebehovUtils";
import { tilLesbarDatoMedArUtenManedNavn } from "@/utils/datoUtils";
import { MotebehovVeilederDTO } from "@/data/motebehov/types/motebehovTypes";
import { ledereUtenMotebehovsvar } from "@/utils/ledereUtils";
import { useOppfolgingstilfellePersonQuery } from "@/data/oppfolgingstilfelle/person/oppfolgingstilfellePersonQueryHooks";
import { NarmesteLederRelasjonDTO } from "@/data/leder/ledereTypes";
import { capitalizeAllWords } from "@/utils/stringUtils";
import MotebehovKvitteringInnhold from "@/sider/dialogmoter/motebehov/MotebehovKvitteringInnhold";
import { useNavBrukerData } from "@/data/navbruker/navbruker_hooks";

export const arbeidsgiverNavnEllerTomStreng = (lederNavn: string | null) => {
  return lederNavn ? `${lederNavn}` : "";
};

export const setSvarTekst = (deltakerOnskerMote?: boolean) => {
  switch (deltakerOnskerMote) {
    case true: {
      return " har svart JA";
    }
    case false: {
      return " har svart NEI";
    }
    default: {
      return " har ikke svart";
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

export const bareArbeidsgiversMotebehov = (motebehov: MotebehovVeilederDTO) => {
  return motebehov.opprettetAv !== motebehov.aktorId;
};

const composePersonSvarText = (
  personIngress: string,
  personNavn?: string,
  harMotebehov?: boolean,
  svarOpprettetDato?: Date
) => {
  const svarResultat = setSvarTekst(harMotebehov);
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
  arbeidstakersMotebehov?: MotebehovVeilederDTO;
}

export const MotebehovKvitteringInnholdArbeidstaker = ({
  arbeidstakersMotebehov,
}: MotebehovKvitteringInnholdArbeidstakerProps) => {
  const sykmeldt = useNavBrukerData();
  const arbeidstakerOnskerMote =
    arbeidstakersMotebehov?.motebehovSvar?.harMotebehov;

  const arbeidstakerTekst = composePersonSvarText(
    "Den sykmeldte: ",
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

interface MotebehovKvitteringInnholdArbeidsgiverProps {
  motebehovListeMedBareArbeidsgiversMotebehov: MotebehovVeilederDTO[];
}

export const composeArbeidsgiverSvarText = (
  lederNavn: string | null,
  harMotebehov?: boolean,
  svarOpprettetDato?: Date
) => {
  return composePersonSvarText(
    "Nærmeste leder: ",
    arbeidsgiverNavnEllerTomStreng(capitalizeAllWords(lederNavn || "")),
    harMotebehov,
    svarOpprettetDato
  );
};

export const MotebehovKvitteringInnholdArbeidsgiver = ({
  motebehovListeMedBareArbeidsgiversMotebehov,
}: MotebehovKvitteringInnholdArbeidsgiverProps) => (
  <>
    {motebehovListeMedBareArbeidsgiversMotebehov.map((motebehov, index) => {
      const arbeidsgiverOnskerMote = motebehov.motebehovSvar?.harMotebehov;
      const ikonAltTekst = `Arbeidsgiver ${arbeidsgiverNavnEllerTomStreng(
        motebehov.opprettetAvNavn
      )} ${ikonAlternativTekst(arbeidsgiverOnskerMote)}`;

      return (
        <MotebehovKvitteringInnhold
          key={index}
          deltakerOnskerMote={arbeidsgiverOnskerMote}
          ikonAltTekst={ikonAltTekst}
          motebehov={motebehov}
          tekst={composeArbeidsgiverSvarText(
            motebehov.opprettetAvNavn,
            arbeidsgiverOnskerMote,
            motebehov.opprettetDato
          )}
        />
      );
    })}
  </>
);

interface MotebehovKvitteringInnholdArbeidsgiverUtenMotebehovProps {
  ledereUtenInnsendtMotebehov: NarmesteLederRelasjonDTO[];
}

export const MotebehovKvitteringInnholdArbeidsgiverUtenMotebehov = ({
  ledereUtenInnsendtMotebehov,
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
            tekst={composeArbeidsgiverSvarText(leder.narmesteLederNavn)}
          />
        );
      }
    )}
  </>
);

interface MotebehovKvitteringProps {
  motebehovData: MotebehovVeilederDTO[];
  ledereData: NarmesteLederRelasjonDTO[];
}

const MotebehovKvittering = ({
  motebehovData,
  ledereData,
}: MotebehovKvitteringProps) => {
  const { tilfellerDescendingStart, latestOppfolgingstilfelle } =
    useOppfolgingstilfellePersonQuery();

  const aktiveMotebehovSvar = motebehovFromLatestActiveTilfelle(
    motebehovData?.sort(sorterMotebehovDataEtterDato),
    latestOppfolgingstilfelle
  );

  const ledereUtenInnsendtMotebehov = ledereUtenMotebehovsvar(
    ledereData,
    motebehovData,
    tilfellerDescendingStart || []
  );

  return (
    <div>
      <MotebehovKvitteringInnholdArbeidstaker
        arbeidstakersMotebehov={finnArbeidstakerMotebehovSvar(
          aktiveMotebehovSvar
        )}
      />
      <MotebehovKvitteringInnholdArbeidsgiver
        motebehovListeMedBareArbeidsgiversMotebehov={aktiveMotebehovSvar.filter(
          bareArbeidsgiversMotebehov
        )}
      />
      <MotebehovKvitteringInnholdArbeidsgiverUtenMotebehov
        ledereUtenInnsendtMotebehov={ledereUtenInnsendtMotebehov}
      />
    </div>
  );
};

export default MotebehovKvittering;
