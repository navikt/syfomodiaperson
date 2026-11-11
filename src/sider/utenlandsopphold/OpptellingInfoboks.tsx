import { BodyShort, InfoCard, VStack } from "@navikt/ds-react";
import {
  ExclamationmarkTriangleIcon,
  InformationSquareIcon,
} from "@navikt/aksel-icons";
import {
  InfoTilBehandling,
  Opptelling,
} from "@/data/utenlandsopphold/utenlandsoppholdTypes";
import { formatNumericDateRange } from "@/utils/datoUtils";

const texts = {
  title: "Opptelling av dager utenfor EU/EØS",
  description:
    "Antall dager utenfor EU/EØS i året frem til slutten av hver søkte periode, dersom søknaden innvilges.",
  vindu: "Periode som telles",
  brukt: "Dager brukt",
  potensieltBrukt:
    "Dager brukt inkl. andre ubehandlede søknader og Infotrygd",
  igjen: "Dager igjen",
  overskredet: "Grensen på antall dager overskrides.",
};

function dagerIgjen(opptelling: Opptelling): number {
  return (
    opptelling.maksAntallDager -
    opptelling.antallDagerPotensieltBruktHvisInnvilget
  );
}

interface OpptellingProps {
  opptelling: Opptelling;
}

function OpptellingRad({ opptelling }: OpptellingProps) {
  const igjen = dagerIgjen(opptelling);

  return (
    <VStack>
      <BodyShort size="small" weight="semibold">
        {texts.vindu}: {formatNumericDateRange(opptelling.fom, opptelling.tom)}
      </BodyShort>
      <BodyShort size="small">
        {texts.brukt}: {opptelling.antallDagerBruktHvisInnvilget} av{" "}
        {opptelling.maksAntallDager}
      </BodyShort>
      <BodyShort size="small">
        {texts.potensieltBrukt}:{" "}
        {opptelling.antallDagerPotensieltBruktHvisInnvilget}
      </BodyShort>
      <BodyShort size="small" weight={igjen < 0 ? "semibold" : undefined}>
        {texts.igjen}: {igjen}
      </BodyShort>
    </VStack>
  );
}

interface Props {
  infoTilBehandling: InfoTilBehandling;
}

/**
 * Viser opptelling av dager utenfor EU/EØS for en søknad som ikke er behandlet.
 */
export function OpptellingInfoboks({ infoTilBehandling }: Props) {
  const { opptellinger } = infoTilBehandling;
  if (opptellinger.length === 0) {
    return null;
  }

  const isOverskredet = opptellinger.some(
    (opptelling) => dagerIgjen(opptelling) < 0,
  );

  return (
    <InfoCard
      data-color={isOverskredet ? "warning" : "info"}
      size="small"
      className="w-fit"
    >
      <InfoCard.Header
        icon={
          isOverskredet ? (
            <ExclamationmarkTriangleIcon aria-hidden />
          ) : (
            <InformationSquareIcon aria-hidden />
          )
        }
      >
        <InfoCard.Title>{texts.title}</InfoCard.Title>
      </InfoCard.Header>
      <InfoCard.Content>
        <VStack gap="space-12">
          <BodyShort size="small">{texts.description}</BodyShort>
          {opptellinger.map((opptelling) => (
            <OpptellingRad key={opptelling.tom.getTime()} opptelling={opptelling} />
          ))}
          {isOverskredet && (
            <BodyShort size="small" weight="semibold">
              {texts.overskredet}
            </BodyShort>
          )}
        </VStack>
      </InfoCard.Content>
    </InfoCard>
  );
}
