import React from "react";
import { SantaTransparent } from "../../img/ImageComponents";

export const Santa = () => {
  const [animation, setAnimation] = React.useState("none");

  const setRandomAnimationType = () => {
    const animationTypes = ["spin", "ping", "pulse", "bounce"].filter(
      (type) => type !== animation
    );
    setAnimation(
      animationTypes[Math.floor(Math.random() * animationTypes.length)]
    );
    console.log("AMI: ", animation);
  };

  return (
    <div
      className="flex flex-row items-center"
      onClick={setRandomAnimationType}
    >
      <img
        className={`pl-2 w-10 animate-[${animation}_1s_ease-in-out]`}
        src={SantaTransparent}
        alt={"nisse"}
      />
    </div>
  );
};
