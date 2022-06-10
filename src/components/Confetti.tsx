import ConfettiExplosion from "@reonomy/react-confetti-explosion";
import React, { useEffect } from "react";

interface ConfettiProps {
  explode: boolean;
}

const tinyExplodeProps = {
  force: 0.4,
  duration: 2000,
  particleCount: 30,
  floorHeight: 800,
  floorWidth: 300,
};

const Confetti = ({ explode }: ConfettiProps) => {
  const [isExploding, setIsExploding] = React.useState(false);

  useEffect(() => {
    if (explode) {
      setIsExploding(true);
      setTimeout(() => {
        setIsExploding(false);
      }, tinyExplodeProps.duration);
    }
  }, [explode]);

  return <>{isExploding && <ConfettiExplosion {...tinyExplodeProps} />}</>;
};

export default Confetti;
