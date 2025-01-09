import React from "react";
import { EksternLenke } from "@/components/EksternLenke";

const texts = {
  link: "Kunnskapsbank trygdemedisin",
};

const url =
  "https://navno.sharepoint.com/sites/fag-og-ytelser-Kunnskapsbank-trygdemedisin";

export default function KunnskapsbankTrygdemedisinLenke() {
  return <EksternLenke href={url}>{texts.link}</EksternLenke>;
}
