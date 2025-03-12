import * as React from "react";
import PengestoppHistorikk from "./PengestoppHistorikk";
import { SykmeldingOldFormat } from "@/data/sykmelding/types/SykmeldingOldFormat";
import { Status, StatusEndring } from "@/data/pengestopp/types/FlaggPerson";
import { usePengestoppStatusQuery } from "@/data/pengestopp/pengestoppQueryHooks";
import { Alert, BodyShort, Box, Heading } from "@navikt/ds-react";

export const texts = {
  hentingFeiletMessage:
    "Vi har problemer med baksystemene. Du kan sende beskjeden, men det vil ikke bli synlig her før vi er tilbake i normal drift",
  beskjeder: "Tidligere sendte beskjeder om stans av sykepenger",
  ingenBeskjeder: "Ingen beskjeder",
};

interface IPengestoppProps {
  sykmeldinger: SykmeldingOldFormat[];
}

const Pengestopp = ({ sykmeldinger }: IPengestoppProps) => {
  const { data: statusEndringList, isError } = usePengestoppStatusQuery();
  const pengestopp: StatusEndring | undefined = statusEndringList.find(
    (statusEndring: StatusEndring) =>
      statusEndring.status === Status.STOPP_AUTOMATIKK
  );

  return (
    <Box background="surface-default" padding="4" className="mb-4">
      <Heading size="small">{texts.beskjeder}</Heading>
      {isError && (
        <Alert variant="error" size="small" className="mb-4">
          {texts.hentingFeiletMessage}
        </Alert>
      )}
      {pengestopp?.status === Status.STOPP_AUTOMATIKK ? (
        <PengestoppHistorikk
          statusEndringList={statusEndringList}
          sykmeldinger={sykmeldinger}
        />
      ) : (
        <BodyShort size={"small"}>{texts.ingenBeskjeder}</BodyShort>
      )}
    </Box>
  );
};

export default Pengestopp;
