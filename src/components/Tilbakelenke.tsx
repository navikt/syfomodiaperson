import React from "react";
import { Link } from "react-router-dom";

interface Props {
  to: string;
  tekst: string;
}

export default function Tilbakelenke({ to, tekst }: Props) {
  return (
    <div className="mt-2 mb-8">
      <Link to={to} className="tilbakelenke">
        {tekst}
      </Link>
    </div>
  );
}
