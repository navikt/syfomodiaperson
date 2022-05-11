import Side from "../../../sider/Side";
import { MOETEPLANLEGGER } from "@/enums/menypunkter";
import React, { ReactElement } from "react";
import Sidetopp from "../../Sidetopp";
import DialogmoteInnkallingSkjema from "./DialogmoteInnkallingSkjema";
import SideLaster from "../../SideLaster";
import styled from "styled-components";
import { AlertstripeFullbredde } from "../../AlertstripeFullbredde";
import { BrukerKanIkkeVarslesPapirpostAdvarsel } from "@/components/dialogmote/BrukerKanIkkeVarslesPapirpostAdvarsel";
import { useNavBrukerData } from "@/data/navbruker/navbruker_hooks";
import { useDialogmoterQuery } from "@/data/dialogmote/dialogmoteQueryHooks";
import { Navigate } from "react-router-dom";
import { moteoversiktRoutePath } from "@/routers/AppRouter";
import { useLedereQuery } from "@/data/leder/ledereQueryHooks";
import { useOppfolgingstilfellePersonQuery } from "@/data/oppfolgingstilfelle/person/oppfolgingstilfellePersonQueryHooks";
import Tilbakelenke from "@/components/Tilbakelenke";

const texts = {
  title: "Innkalling til dialogmøte",
  tilbake: "Tilbake",
  nyLosningAlert:
    "I denne nye løsningen sender du innkalling, avlysning, endring av tidspunkt og referat. I Arena trenger du bare endre status til ferdig behandlet.",
  noTilfelleAlert:
    "Vi kan ikke sende innkalling til dialogmøte til denne arbeidstakeren. Årsaken er at det ikke er registrert noen aktiv sykmelding, eller det er mer enn 16 dager siden siste sykmelding gikk ut.",
};

const StyledAlert = styled(AlertstripeFullbredde)`
  margin-bottom: 2.5em;
`;

const DialogmoteInnkallingSide = (): ReactElement => {
  const { brukerKanIkkeVarslesDigitalt } = useNavBrukerData();
  const { hasActiveOppfolgingstilfelle } = useOppfolgingstilfellePersonQuery();

  return hasActiveOppfolgingstilfelle ? (
    <>
      <StyledAlert type="advarsel">{texts.nyLosningAlert}</StyledAlert>
      {brukerKanIkkeVarslesDigitalt && (
        <BrukerKanIkkeVarslesPapirpostAdvarsel />
      )}
      <DialogmoteInnkallingSkjema pageTitle={texts.title} />
    </>
  ) : (
    <>
      <StyledAlert type="feil">{texts.noTilfelleAlert}</StyledAlert>
      <Tilbakelenke to={moteoversiktRoutePath} tekst={texts.tilbake} />
    </>
  );
};

const DialogmoteInnkallingContainer = (): ReactElement => {
  const {
    isLoading: henterLedere,
    isError: hentingLedereFeilet,
  } = useLedereQuery();
  const { aktivtDialogmote } = useDialogmoterQuery();
  const {
    isLoading: henterOppfolgingstilfeller,
    isError: hentingOppfolgingstilfellerFeilet,
  } = useOppfolgingstilfellePersonQuery();

  if (aktivtDialogmote) {
    return <Navigate to={moteoversiktRoutePath} />;
  }

  const henter = henterLedere || henterOppfolgingstilfeller;
  const hentingFeilet =
    hentingLedereFeilet || hentingOppfolgingstilfellerFeilet;

  return (
    <Side tittel={texts.title} aktivtMenypunkt={MOETEPLANLEGGER}>
      <SideLaster henter={henter} hentingFeilet={hentingFeilet}>
        <Sidetopp tittel={texts.title} />
        <DialogmoteInnkallingSide />
      </SideLaster>
    </Side>
  );
};

export default DialogmoteInnkallingContainer;
