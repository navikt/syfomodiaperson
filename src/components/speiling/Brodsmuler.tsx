import React, { useState } from "react";
import { PersonImage } from "../../../img/ImageComponents";

export type Brodsmule = {
  tittel: string;
  sisteSmule?: boolean;
};

const Brodsmule = ({ tittel, sisteSmule }: Brodsmule) => {
  if (sisteSmule) {
    return (
      <span className="js-smuletekst">
        <span className="vekk">Du er her:</span>{" "}
        <span className="brodsmule">{tittel}</span>
      </span>
    );
  }

  return (
    <span>
      <span className="brodsmule">{tittel}</span>
      <span className="brodsmule__skille"> / </span>
    </span>
  );
};

interface ToggleLinkProps {
  onClick(event: React.MouseEvent<HTMLAnchorElement>): void;
}

const ToggleLink = ({ onClick }: ToggleLinkProps) => {
  return (
    <span>
      <a
        role="button"
        aria-label="Vis hele brødsmulestien"
        className="js-toggle brodsmule"
        href="#"
        onClick={onClick}
      >
        ...
      </a>
      <span className="brodsmule__skille"> / </span>
    </span>
  );
};

interface BrodsmulerProps {
  brodsmuler: Brodsmule[];
}

const getSynligeBrodsmuler = (
  brodsmuler: Brodsmule[],
  shouldVisCollapsed: boolean
) => {
  if (shouldVisCollapsed) {
    return [
      brodsmuler[brodsmuler.length - 2],
      brodsmuler[brodsmuler.length - 1],
    ];
  }
  return brodsmuler;
};

const Brodsmuler = ({ brodsmuler }: BrodsmulerProps) => {
  const [visCollapsed, setVisCollapsed] = useState(true);

  const shouldVisCollapsed = brodsmuler.length > 3 && visCollapsed;

  const synligeBrodsmuler = getSynligeBrodsmuler(
    brodsmuler,
    shouldVisCollapsed
  );
  return (
    <nav
      role="navigation"
      className="brodsmuler side-innhold"
      aria-label="Du er her: "
    >
      <img src={PersonImage} alt="Du" className="brodsmuler__ikon" />
      <span className="js-smule brodsmule">Ditt NAV</span>
      {brodsmuler.length && <span className="brodsmule__skille"> / </span>}
      {shouldVisCollapsed && (
        <ToggleLink
          onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
            e.preventDefault();
            setVisCollapsed(false);
          }}
        />
      )}
      {synligeBrodsmuler
        .map((smule: Brodsmule, index: number) => ({
          ...smule,
          sisteSmule: synligeBrodsmuler.length === index + 1,
        }))
        .map((smule: Brodsmule, index: number) => (
          <Brodsmule key={index} {...smule} />
        ))}
    </nav>
  );
};

export default Brodsmuler;
