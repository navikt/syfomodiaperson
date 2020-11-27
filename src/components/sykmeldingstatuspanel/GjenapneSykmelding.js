import React from "react";

const texts = {
  bruk: "Bruk sykmeldingen",
};

const GjenapneSykmelding = () => {
  return (
    <div className="verktoylinje">
      <button className="knapp knapp--mini js-gjenaapne-sykmelding">
        {texts.bruk}
      </button>
    </div>
  );
};

export default GjenapneSykmelding;
