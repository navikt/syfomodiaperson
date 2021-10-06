import * as React from "react";
import { Column } from "nav-frontend-grid";
import { groupVedtakByOrgnr } from "@/utils/vedtakUtils";
import VedtakEkspanderbartPanel from "./VedtakEkspanderbartPanel";
import { VedtakDTO } from "@/data/vedtak/vedtakTypes";

interface VedtakColumnProps {
  data: VedtakDTO[];
  selectedVedtak?: VedtakDTO;
  setSelectedVedtak: (vedtak: VedtakDTO) => void;
}

const VedtakColumn = (columnProps: VedtakColumnProps) => {
  const { data, selectedVedtak, setSelectedVedtak } = columnProps;

  return (
    <Column className="vedtak col-xs-5">
      {groupVedtakByOrgnr(data).map(
        (vedtakPerArbeidsgiver: VedtakDTO[], index: number) => (
          <VedtakEkspanderbartPanel
            key={index}
            selectedVedtak={selectedVedtak}
            setSelectedVedtak={(x: VedtakDTO) => {
              setSelectedVedtak(x);
            }}
            vedtakPerArbeidsgiver={vedtakPerArbeidsgiver}
          />
        )
      )}
    </Column>
  );
};

export default VedtakColumn;
