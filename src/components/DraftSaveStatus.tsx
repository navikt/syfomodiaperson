import { Alert } from "@navikt/ds-react";
import { SaveFile } from "../../img/ImageComponents";
import {
  addDays,
  showTimeIncludingSeconds,
  formatDateWithoutYear,
} from "@/utils/datoUtils";

interface Props {
  isSaveError: boolean;
  savedTime?: Date;
}

const texts = {
  saved: "Utkast lagret, utløper ",
  saveFailed: "Lagring av utkast feilet",
};

export function DraftSaveStatus({ isSaveError, savedTime }: Props) {
  return (
    <>
      {isSaveError && (
        <Alert variant="error" size="small">
          {texts.saveFailed}
        </Alert>
      )}
      {!isSaveError && savedTime && (
        <div className="mb-2 font-ax-bold flex gap-2">
          <img src={SaveFile} alt="saved" />
          <span>{`${texts.saved} ${formatDateWithoutYear(
            addDays(savedTime, 7),
          )} ${showTimeIncludingSeconds(savedTime)}`}</span>
        </div>
      )}
    </>
  );
}
