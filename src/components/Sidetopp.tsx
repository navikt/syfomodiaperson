import React from "react";

interface SidetoppProps {
  tittel: string;
  intro?: string;
}

const Sidetopp = (sidetoppProps: SidetoppProps) => {
  const { tittel, intro } = sidetoppProps;
  return (
    <header className="sidetopp js-sidetopp">
      <h1 className="sidetopp__tittel">{tittel}</h1>
      {intro && (
        <div className="sidetopp__intro js-intro">
          <p>{intro}</p>
        </div>
      )}
    </header>
  );
};

export default Sidetopp;
