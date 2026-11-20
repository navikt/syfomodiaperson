import { InfoCard } from "@navikt/ds-react";
import { ExclamationmarkTriangleIcon } from "@navikt/aksel-icons";

const texts = {
  noNarmesteleder:
    "Det er ikke registrert en nærmeste leder fra denne arbeidsgiveren, derfor sender vi dette brevet automatisk " +
    "til Altinn. Lederen må registrere seg som nærmeste leder i Altinn for å kunne gi svar på Nav.no.",
};

export const NoNarmesteLederAlert = () => (
  <InfoCard data-color="warning" size="small" className="mb-4">
    <InfoCard.Message icon={<ExclamationmarkTriangleIcon aria-hidden />}>
      {texts.noNarmesteleder}
    </InfoCard.Message>
  </InfoCard>
);
