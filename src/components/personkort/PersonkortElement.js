import React from "react";
import PropTypes from "prop-types";
import cn from "classnames";

const PersonkortElement = ({
  tittel,
  imgUrl,
  children,
  antallKolonner = 2,
  titleMetaChildren,
}) => {
  const imgAlt = imgUrl && imgUrl.split("/").reverse()[0].split(".")[0];
  const classNameRad = cn("personkortElement__rad", {
    "personkortElement__rad--treKolonner": antallKolonner === 3,
    "personkortElement__rad--toKolonner": antallKolonner === 2,
  });
  return (
    <div className="personkortElement">
      {titleMetaChildren ? (
        titleMetaChildren
      ) : (
        <div className="personkortElement__tittel">
          <img src={imgUrl} alt={imgAlt} />
          <h4>{tittel}</h4>
        </div>
      )}
      <div className={classNameRad}>{children}</div>
    </div>
  );
};

PersonkortElement.propTypes = {
  tittel: PropTypes.string,
  imgUrl: PropTypes.string,
  antallKolonner: PropTypes.number,
  children: PropTypes.node,
  titleLabelText: PropTypes.string,
  titleMetaChildren: PropTypes.node,
};

export default PersonkortElement;
