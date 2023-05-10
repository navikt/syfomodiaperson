import React from "react";
import { Link } from "@navikt/ds-react";
import { useBehandlerdialogVedleggQuery } from "@/data/behandlerdialog/behandlerdialogQueryHooks";
import AppSpinner from "@/components/AppSpinner";

const createPdfBlob = (data: ArrayBuffer | undefined) => {
  return !!data
    ? new Blob([data], {
        type: "application/pdf",
      })
    : new Blob();
};

interface PdfVedleggProps {
  meldingUuid: string;
  vedleggNumber: number;
  skalHenteVedlegg: boolean;
}

const PdfVedleggLink = ({
  meldingUuid,
  vedleggNumber,
  skalHenteVedlegg,
}: PdfVedleggProps) => {
  const { data, isFetching } = useBehandlerdialogVedleggQuery(
    meldingUuid,
    vedleggNumber,
    skalHenteVedlegg
  );

  const blob = createPdfBlob(data);
  const pdfUrl = data?.byteLength ? URL.createObjectURL(blob) : undefined;
  const oneIndexedVedleggNumber = vedleggNumber + 1;
  return (
    <>
      {isFetching ? (
        <AppSpinner size={"small"} />
      ) : (
        <Link href={pdfUrl} target="_blank" rel="noreferrer">
          Vedlegg {oneIndexedVedleggNumber}
        </Link>
      )}
    </>
  );
};

export default PdfVedleggLink;
