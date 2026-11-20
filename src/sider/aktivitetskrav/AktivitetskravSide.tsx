import { useOppfolgingstilfellePersonQuery } from "@/data/oppfolgingstilfelle/person/oppfolgingstilfellePersonQueryHooks";
import { VurderAktivitetskrav } from "@/sider/aktivitetskrav/vurdering/VurderAktivitetskrav";
import { useAktivitetskravQuery } from "@/data/aktivitetskrav/aktivitetskravQueryHooks";
import { AktivitetskravHistorikk } from "@/sider/aktivitetskrav/historikk/AktivitetskravHistorikk";
import { StartNyVurdering } from "./vurdering/StartNyVurdering";
import { AktivitetskravStatus } from "@/data/aktivitetskrav/aktivitetskravTypes";
import { BodyShort, InfoCard } from "@navikt/ds-react";
import { ExclamationmarkTriangleIcon } from "@navikt/aksel-icons";

const texts = {
  noTilfelleTitle: "Vi finner ingen aktiv sykmelding på denne personen",
  noTilfelleBody:
    "Du kan likevel vurdere aktivitetskravet hvis det er behov for det.",
};

export const AktivitetskravSide = () => {
  const { hasActiveOppfolgingstilfelle } = useOppfolgingstilfellePersonQuery();
  const { data } = useAktivitetskravQuery();

  const aktivitetskrav = data.find(
    (aktivitetskrav) =>
      aktivitetskrav.status !== AktivitetskravStatus.AUTOMATISK_OPPFYLT &&
      aktivitetskrav.status !== AktivitetskravStatus.LUKKET,
  );
  const showStartNyVurdering = !aktivitetskrav || aktivitetskrav.inFinalState;

  return (
    <div className="w-full">
      {!hasActiveOppfolgingstilfelle && (
        <InfoCard data-color="warning" size="small" className="mb-4">
          <InfoCard.Header icon={<ExclamationmarkTriangleIcon aria-hidden />}>
            <InfoCard.Title>{texts.noTilfelleTitle}</InfoCard.Title>
          </InfoCard.Header>
          <InfoCard.Content>
            <BodyShort size="small">{texts.noTilfelleBody}</BodyShort>
          </InfoCard.Content>
        </InfoCard>
      )}
      {showStartNyVurdering ? (
        <StartNyVurdering aktivitetskrav={aktivitetskrav} />
      ) : (
        <VurderAktivitetskrav aktivitetskrav={aktivitetskrav} />
      )}
      <AktivitetskravHistorikk />
    </div>
  );
};
