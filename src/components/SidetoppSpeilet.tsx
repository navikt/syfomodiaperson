import React from "react";

interface SidetoppSpeiletProps {
  tittel: string;
  intro?: string;
}

const SidetoppSpeilet = (sidetoppSpeiletProps: SidetoppSpeiletProps) => {
  const { tittel, intro } = sidetoppSpeiletProps;
  return (
    <header className="sidetoppSpeilet">
      <h1 className="sidetoppSpeilet__tittel">{tittel}</h1>
      {intro && (
        <div className="sidetoppSpeilet__intro side-innhold js-intro">
          <p>{intro}</p>
        </div>
      )}
    </header>
  );
};

export default SidetoppSpeilet;
