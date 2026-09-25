import { Button } from "@navikt/ds-react";
import { EyeWithPupilIcon } from "@navikt/aksel-icons";
import { ForhandsvisningModal } from "@/components/ForhandsvisningModal";
import { useState } from "react";
import { MeldingDTO } from "@/data/behandlerdialog/behandlerdialogTypes";

const texts = {
  visButton: "Se hele meldingen",
  visContentLabel: "Vis melding",
};

interface VisMeldingProps {
  melding: MeldingDTO;
}

export const VisMelding = ({ melding }: VisMeldingProps) => {
  const [visMelding, setVisMelding] = useState(false);
  return (
    <>
      <Button
        className="ml-auto"
        onClick={() => setVisMelding(true)}
        variant="secondary"
        size="small"
        icon={<EyeWithPupilIcon aria-hidden />}
      >
        {texts.visButton}
      </Button>
      <ForhandsvisningModal
        contentLabel={texts.visContentLabel}
        isOpen={visMelding}
        handleClose={() => setVisMelding(false)}
        getDocumentComponents={() => melding.document}
      />
    </>
  );
};
