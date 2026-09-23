import { useState } from "react";
import { EasterRoll } from "../../../img/ImageComponents";

export const Easter = () => {
  const [imgSrc, setImgSrc] = useState<string>(EasterRoll);

  const replayGif = () => {
    setImgSrc("none");
    setTimeout(() => {
      setImgSrc(EasterRoll);
    }, 0);
  };

  return (
    <div>
      <img
        className="w-full flex-1"
        src={imgSrc}
        alt="påskekylling gif"
        onClick={replayGif}
      />
    </div>
  );
};
