import React, { ReactElement } from "react";
import { DialogmoteSideContainer } from "../DialogmoteSideContainer";
import Referat, { ReferatMode } from "./Referat";

const texts = {
  pageTitle: "Referat fra dialogmøte",
  pageHeader: "Referat fra dialogmøte",
};

const DialogmoteReferatContainer = (): ReactElement => (
  <DialogmoteSideContainer title={texts.pageTitle} header={texts.pageHeader}>
    {(dialogmote) => (
      <Referat
        dialogmote={dialogmote}
        pageTitle={texts.pageTitle}
        mode={ReferatMode.NYTT}
      />
    )}
  </DialogmoteSideContainer>
);

export default DialogmoteReferatContainer;
