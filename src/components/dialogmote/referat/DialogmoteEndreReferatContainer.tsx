import React, { ReactElement } from "react";
import { DialogmoteSideContainer } from "../DialogmoteSideContainer";
import Referat, { ReferatMode } from "./Referat";

const texts = {
  pageTitle: "Endre referat fra dialogmøte",
  pageHeader: "Endre referat fra dialogmøte",
};

const DialogmoteEndreReferatContainer = (): ReactElement => (
  <DialogmoteSideContainer title={texts.pageTitle} header={texts.pageHeader}>
    {(dialogmote) => (
      <Referat
        dialogmote={dialogmote}
        pageTitle={texts.pageTitle}
        mode={ReferatMode.ENDRET}
      />
    )}
  </DialogmoteSideContainer>
);

export default DialogmoteEndreReferatContainer;
