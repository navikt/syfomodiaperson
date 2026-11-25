import { ReactElement } from "react";
import { SykmeldingOldFormat } from "@/data/sykmelding/types/SykmeldingOldFormat";
import SykmeldingLinkPanel from "./SykmeldingLinkPanel";
import { BodyShort, Box, Heading } from "@navikt/ds-react";

interface SykmeldingTeasereProps {
  sykmeldinger: SykmeldingOldFormat[];
  tittel: string;
  ingenSykmeldingerMelding: string;
  children?: ReactElement;
}

export default function Sykmeldinger({
  sykmeldinger,
  tittel,
  ingenSykmeldingerMelding,
  children,
}: SykmeldingTeasereProps): ReactElement {
  const hasSykmeldinger = !!sykmeldinger.length;
  return (
    <div className="mb-4">
      <Box
        background="default"
        padding="space-16"
        className="flex flex-col gap-4"
      >
        <div className="flex justify-between gap-4 items-center mb-px w-full">
          <div>
            <Heading size="small" level="5">
              {tittel}
            </Heading>
            {!hasSykmeldinger && (
              <BodyShort size="small" className="flex-1 mt-3">
                {ingenSykmeldingerMelding}
              </BodyShort>
            )}
          </div>
          {children}
        </div>
        {hasSykmeldinger && (
          <ul className="flex flex-col gap-1 list-none m-0 p-0">
            {sykmeldinger.map((sykmelding, idx) => (
              <li key={idx}>
                <SykmeldingLinkPanel sykmelding={sykmelding} />
              </li>
            ))}
          </ul>
        )}
      </Box>
    </div>
  );
}
