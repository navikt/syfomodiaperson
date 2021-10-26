import React, { ReactElement } from "react";
import cn from "classnames";

interface PersonkortElementProps {
  tittel: string;
  imgUrl: string;
  imgAlt: string;
  children: ReactElement;
  antallKolonner?: number;
}

const PersonkortElement = (personkortElementProps: PersonkortElementProps) => {
  const {
    tittel,
    imgUrl,
    imgAlt,
    children,
    antallKolonner = 2,
  } = personkortElementProps;
  const classNameRad = cn("personkortElement__rad", {
    "personkortElement__rad--treKolonner": antallKolonner === 3,
    "personkortElement__rad--toKolonner": antallKolonner === 2,
  });
  return (
    <div className="personkortElement">
      <div className="personkortElement__tittel">
        <img src={imgUrl} alt={imgAlt} />
        <h4>{tittel}</h4>
      </div>
      <div className={classNameRad}>{children}</div>
    </div>
  );
};

export default PersonkortElement;
