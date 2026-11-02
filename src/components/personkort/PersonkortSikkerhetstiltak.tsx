import { useNavBrukerData } from "@/data/navbruker/navbruker_hooks";
import { Detail } from "@navikt/ds-react";
import { formatNumericDateRange } from "@/utils/datoUtils";
import { PersonkortElement } from "@/components/personkort/PersonkortElement";
import { ExclamationmarkTriangleFillIcon } from "@navikt/aksel-icons";

export function PersonkortSikkerhetstiltak() {
  const { sikkerhetstiltak } = useNavBrukerData();

  return (
    <PersonkortElement
      tittel="Sikkerhetstiltak"
      icon={
        <ExclamationmarkTriangleFillIcon
          className="mr-2"
          color="var(--ax-text-danger-decoration)"
          title="advarsel-ikon"
          fontSize="1.5rem"
        />
      }
    >
      <>
        {sikkerhetstiltak.map(
          ({ beskrivelse, gyldigFom, gyldigTom }, index) => (
            <div key={index}>
              <Detail textColor="subtle">
                {`Gyldig: ${formatNumericDateRange(gyldigFom, gyldigTom)}`}
              </Detail>
              {beskrivelse}
            </div>
          ),
        )}
      </>
    </PersonkortElement>
  );
}
