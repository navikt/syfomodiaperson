import React, { ReactElement, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAppSelector } from "../../hooks/hooks";
import { useDispatch } from "react-redux";
import { fetchDialogmote } from "../../data/dialogmote/dialogmote_actions";
import Side from "../../sider/Side";
import { MOETEPLANLEGGER } from "../../enums/menypunkter";
import SideLaster from "../SideLaster";
import Sidetopp from "../Sidetopp";
import Feilmelding from "../Feilmelding";
import { DialogmoteDTO } from "../../data/dialogmote/dialogmoteTypes";

interface DialogmoteSideProps {
  title: string;
  header: string;
  children: (dialogmote: DialogmoteDTO) => ReactElement;
}

const texts = {
  moteNotFound: "Fant ikke dialogmøte",
};

export const DialogmoteSideContainer = ({
  title,
  header,
  children,
}: DialogmoteSideProps): ReactElement => {
  const { dialogmoteUuid, fnr } = useParams<{
    dialogmoteUuid: string;
    fnr: string;
  }>();
  const {
    henterMote,
    henterMoteFeilet,
    dialogmoter,
    moterHentet,
  } = useAppSelector((state) => state.dialogmote);

  const dispatch = useDispatch();
  useEffect(() => {
    if (!moterHentet) {
      dispatch(fetchDialogmote(fnr));
    }
  }, [moterHentet]);

  const henter = henterMote;
  const hentingFeilet = henterMoteFeilet;
  const dialogmote = dialogmoter.find(
    (dialogmote) => dialogmote.uuid === dialogmoteUuid
  );

  return (
    <Side fnr={fnr} tittel={title} aktivtMenypunkt={MOETEPLANLEGGER}>
      <SideLaster henter={henter} hentingFeilet={hentingFeilet}>
        <Sidetopp tittel={header} />
        {dialogmote ? (
          children(dialogmote)
        ) : (
          <Feilmelding tittel={texts.moteNotFound} />
        )}
      </SideLaster>
    </Side>
  );
};
