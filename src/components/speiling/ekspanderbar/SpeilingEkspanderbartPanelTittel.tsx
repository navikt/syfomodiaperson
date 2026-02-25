import { FlexRow } from "@/components/Layout";
import React, { useState } from "react";
import styled from "styled-components";
import { Normaltekst } from "nav-frontend-typografi";
import {
  DoctorHoverImage,
  DoctorImage,
  PlasterHoverImage,
  PlasterImage,
} from "../../../../img/ImageComponents";

const TittelTekst = styled(Normaltekst)`
  align-self: center;
`;

const getIconProps = (icon: IconType): IconProps => {
  switch (icon) {
    case "lege": {
      return {
        icon: DoctorImage,
        hover: DoctorHoverImage,
        altText: "Lege",
      };
    }
    case "plaster": {
      return {
        icon: PlasterImage,
        hover: PlasterHoverImage,
        altText: "Plaster-ikon",
      };
    }
  }
};
type IconType = "lege" | "plaster";

interface SpeilingEkspanderbartPanelTittelProps {
  children: string;
  icon?: IconType;
}

export const SpeilingEkspanderbartPanelTittel = ({
  children,
  icon,
}: SpeilingEkspanderbartPanelTittelProps) => (
  <FlexRow>
    {icon && <Icon {...getIconProps(icon)} />}
    <TittelTekst>{children}</TittelTekst>
  </FlexRow>
);

const StyledImg = styled.img`
  width: 2em;
  margin-right: 1em;
`;

interface IconProps {
  icon: string;
  hover: string;
  altText: string;
}

const Icon = ({ icon, hover, altText }: IconProps) => {
  const [src, setSrc] = useState(icon);

  return (
    <StyledImg
      src={src}
      alt={altText}
      onMouseEnter={() => setSrc(hover)}
      onMouseLeave={() => setSrc(icon)}
    />
  );
};
