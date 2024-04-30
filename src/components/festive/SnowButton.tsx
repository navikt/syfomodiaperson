import React from "react";
import { startSnow, stopAndHideSnow } from "@/utils/festiveUtils";
import { Button } from "@navikt/ds-react";

const texts = {
  letItSnow: "La det snø",
  snowButtonTrackingContext: "Jul",
};

const SnowButton = () => {
  // Bruker require her, siden testene får ikke kjørt hvis vi importerer i starten av filen
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const jingle = require("../../../music/jingle_bells_trimmed.mp3");
  const jingleAudio = new Audio(jingle);

  jingleAudio.onended = () => {
    stopAndHideSnow();
  };

  const clickButton = () => {
    if (jingleAudio.paused || jingleAudio.ended) {
      jingleAudio.play();
      startSnow();
    } else {
      stopAndHideSnow();
      jingleAudio.load();
    }
  };

  return (
    <Button
      size="small"
      onClick={clickButton}
      variant="secondary"
      className="ml-auto self-center"
    >
      {texts.letItSnow}
    </Button>
  );
};

export default SnowButton;
