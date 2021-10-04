import React, { ReactElement } from "react";
import { NarmesteLederRelasjonDTO } from "@/data/leder/ledere";
import {
  finnArbeidstakerMotebehovSvar,
  motebehovFromLatestActiveTilfelle,
  sorterMotebehovDataEtterDato,
} from "@/utils/motebehovUtils";
import { tilLesbarDatoMedArUtenManedNavn } from "@/utils/datoUtils";
import { MotebehovVeilederDTO } from "@/data/motebehov/types/motebehovTypes";
import { Brukerinfo } from "@/data/navbruker/types/Brukerinfo";
import {
  MotebehovIkkeSvartImage,
  MotebehovKanIkkeImage,
  MotebehovKanImage,
} from "../../../img/ImageComponents";
import { OppfolgingstilfelleperioderMapState } from "@/data/oppfolgingstilfelle/oppfolgingstilfelleperioder";
import { InfoRow } from "../InfoRow";
import { PaddingSize } from "../Layout";
import { ledereUtenMotebehovsvar } from "@/utils/ledereUtils";

export const arbeidsgiverNavnEllerTomStreng = (lederNavn?: string) => {
  return lederNavn ? `${lederNavn}` : "";
};

export const setSvarIkon = (deltakerOnskerMote?: boolean): string => {
  switch (deltakerOnskerMote) {
    case true: {
      return MotebehovKanImage;
    }
    case false: {
      return MotebehovKanIkkeImage;
    }
    default: {
      return MotebehovIkkeSvartImage;
    }
  }
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

interface MotebehovKvitteringInnholdProps {
  deltakerOnskerMote?: boolean;
  ikonAltTekst: string;
  motebehov?: MotebehovVeilederDTO;
  tekst: ReactElement;
  topPadding?: PaddingSize;
}

export const MotebehovKvitteringInnhold = ({
  deltakerOnskerMote,
  ikonAltTekst,
  motebehov,
  tekst,
  topPadding,
}: MotebehovKvitteringInnholdProps) => {
  return (
    <InfoRow
      icon={setSvarIkon(deltakerOnskerMote)}
      iconAltText={ikonAltTekst}
      title={tekst}
      subtitle={motebehov?.motebehovSvar?.forklaring}
      topPadding={topPadding}
    />
  );
};

interface MotebehovKvitteringInnholdArbeidstakerProps {
  arbeidstakersMotebehov?: MotebehovVeilederDTO;
  sykmeldt?: Brukerinfo;
}

export const MotebehovKvitteringInnholdArbeidstaker = ({
  arbeidstakersMotebehov,
  sykmeldt,
}: MotebehovKvitteringInnholdArbeidstakerProps) => {
  const arbeidstakerOnskerMote =
    arbeidstakersMotebehov?.motebehovSvar?.harMotebehov;

  const arbeidstakerTekst = composePersonSvarText(
    "Den sykmeldte: ",
    sykmeldt?.navn,
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
  lederNavn?: string,
  harMotebehov?: boolean,
  svarOpprettetDato?: Date
) => {
  return composePersonSvarText(
    "Nærmeste leder: ",
    arbeidsgiverNavnEllerTomStreng(lederNavn),
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
          topPadding={PaddingSize.SM}
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
            topPadding={PaddingSize.SM}
          />
        );
      }
    )}
  </>
);

interface MotebehovKvitteringProps {
  motebehovData: MotebehovVeilederDTO[];
  ledereData: NarmesteLederRelasjonDTO[];
  oppfolgingstilfelleperioder: OppfolgingstilfelleperioderMapState;
  sykmeldt?: Brukerinfo;
}

const MotebehovKvittering = ({
  motebehovData,
  ledereData,
  oppfolgingstilfelleperioder,
  sykmeldt,
}: MotebehovKvitteringProps) => {
  const aktiveMotebehovSvar = motebehovFromLatestActiveTilfelle(
    motebehovData?.sort(sorterMotebehovDataEtterDato),
    oppfolgingstilfelleperioder
  );

  const ledereUtenInnsendtMotebehov = ledereUtenMotebehovsvar(
    ledereData,
    motebehovData,
    oppfolgingstilfelleperioder
  );

  return (
    <div>
      <MotebehovKvitteringInnholdArbeidstaker
        arbeidstakersMotebehov={finnArbeidstakerMotebehovSvar(
          aktiveMotebehovSvar
        )}
        sykmeldt={sykmeldt}
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
