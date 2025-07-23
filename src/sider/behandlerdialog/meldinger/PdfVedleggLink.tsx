import React from "react";
import { Link } from "@navikt/ds-react";
import { ISBEHANDLERDIALOG_ROOT } from "@/apiConstants";
import { MeldingDTO } from "@/data/behandlerdialog/behandlerdialogTypes";

const getVedleggLinkText = (
  melding: MeldingDTO,
  vedleggNumber: number
): string => {
  if (melding.isFirstVedleggLegeerklaring) {
    return vedleggNumber === 0 ? "Legeerklæring" : `Vedlegg ${vedleggNumber}`;
  } else {
    return `Vedlegg ${vedleggNumber + 1}`;
  }
};

interface Props {
  melding: MeldingDTO;
  vedleggNumber: number;
}

export default function PdfVedleggLink({ melding, vedleggNumber }: Props) {
  const pdfUrl = `${ISBEHANDLERDIALOG_ROOT}/melding/${melding.uuid}/${vedleggNumber}/pdf`;
  const vedleggLinkText = getVedleggLinkText(melding, vedleggNumber);
  return (
    <Link className="pr-1" href={pdfUrl} target="_blank" rel="noreferrer">
      {vedleggLinkText}
    </Link>
  );
}
