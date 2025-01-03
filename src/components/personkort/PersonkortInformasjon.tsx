import React from "react";

interface Props {
  informasjonNokkelTekster: Map<string, string>;
  informasjon: any;
}

export default function PersonkortInformasjon({
  informasjonNokkelTekster,
  informasjon,
}: Props) {
  return (
    <>
      {Object.keys(informasjon).map((nokkel, idx) => {
        return (
          <dl
            key={`${nokkel}.${idx}`}
            className="personkortElement__informasjon"
          >
            <dt>{informasjonNokkelTekster.get(nokkel)}</dt>
            <dd>{informasjon[nokkel]}</dd>
          </dl>
        );
      })}
    </>
  );
}
