import React, { ReactElement } from "react";
import AvlysDialogmoteSkjema from "./AvlysDialogmoteSkjema";
import { MalformProvider } from "@/context/malform/MalformContext";
import DialogmoteSideContainer from "@/sider/dialogmoter/components/DialogmoteSideContainer";

const texts = {
  avlysDialogmote: "Avlys dialogmøte",
};

export default function AvlysDialogmoteContainer(): ReactElement {
  return (
    <DialogmoteSideContainer
      title={texts.avlysDialogmote}
      header={texts.avlysDialogmote}
    >
      {(dialogmote) => (
        <MalformProvider>
          <AvlysDialogmoteSkjema
            dialogmote={dialogmote}
            pageTitle={texts.avlysDialogmote}
          />
        </MalformProvider>
      )}
    </DialogmoteSideContainer>
  );
}
