import { List } from "@navikt/ds-react";
import React from "react";

const texts = {
  listTitle: "Følgende alternativer er tilgjengelig:",
  stans: {
    bold: "Stans",
    text: " dersom vilkårene i § 8-8 ikke er oppfylt og rett til videre sykepenger skal stanses.",
  },
  oppfylt: {
    bold: "Oppfylt",
    text: " dersom bruker har startet å medvirke, og oppfyller medvirkningsplikten.",
  },
  unntak: {
    bold: "Unntak",
    text: " dersom bruker har rimelig grunn til ikke å medvirke, og dermed er unntatt medvirkningsplikten.",
  },
  ikkeAktuell: {
    bold: "Ikke aktuell",
    text: " dersom det ikke lenger er aktuelt å vurdere medvirkningsplikten, for eksempel ved friskmelding.",
  },
};

interface Props {
  isBeforeForhandsvarselDeadline: boolean;
}

export default function SupportingTextList({
  isBeforeForhandsvarselDeadline,
}: Props) {
  return (
    <List as="ul" title={texts.listTitle}>
      {isBeforeForhandsvarselDeadline ? (
        ""
      ) : (
        <List.Item>
          <span className="font-semibold">{texts.stans.bold}</span>
          {texts.stans.text}
        </List.Item>
      )}
      <List.Item>
        <span className="font-semibold">{texts.oppfylt.bold}</span>
        {texts.oppfylt.text}
      </List.Item>
      <List.Item>
        <span className="font-semibold">{texts.unntak.bold}</span>
        {texts.unntak.text}
      </List.Item>
      <List.Item>
        <span className="font-semibold">{texts.ikkeAktuell.bold}</span>
        {texts.ikkeAktuell.text}
      </List.Item>
    </List>
  );
}
