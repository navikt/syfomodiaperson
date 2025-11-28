import React, { ReactElement } from "react";
import DialogmoteSideContainer from "../DialogmoteSideContainer";
import Referat, { ReferatMode } from "./Referat";
import { MalformProvider } from "@/context/malform/MalformContext";

const texts = {
  pageTitle: "Endre referat fra dialogmøte",
  pageHeader: "Endre referat fra dialogmøte",
};

export default function DialogmoteEndreReferatContainer(): ReactElement {
  return (
    <DialogmoteSideContainer title={texts.pageTitle} header={texts.pageHeader}>
      {(dialogmote) => (
        <MalformProvider>
          <Referat dialogmote={dialogmote} mode={ReferatMode.ENDRET} />
        </MalformProvider>
      )}
    </DialogmoteSideContainer>
  );
}
