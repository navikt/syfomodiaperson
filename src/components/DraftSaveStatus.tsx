import React from "react";
import { Alert } from "@navikt/ds-react";
import { SaveFile } from "../../img/ImageComponents";
import { showTimeIncludingSeconds } from "@/utils/datoUtils";

interface Props {
  isSaveError: boolean;
  savedTime?: Date;
  savedText?: string;
  saveFailedText?: string;
}

const defaultTexts = {
  saved: "Utkast lagret",
  saveFailed: "Lagring av utkast feilet",
};

export function DraftSaveStatus({
  isSaveError,
  savedTime,
  savedText = defaultTexts.saved,
  saveFailedText = defaultTexts.saveFailed,
}: Props) {
  return (
    <>
      {isSaveError && (
        <Alert variant="error" size="small">
          {saveFailedText}
        </Alert>
      )}
      {savedTime && (
        <div className="mb-2 font-bold flex gap-2">
          <img src={SaveFile} alt="saved" />
          <span>{`${savedText} ${showTimeIncludingSeconds(savedTime)}`}</span>
        </div>
      )}
    </>
  );
}
