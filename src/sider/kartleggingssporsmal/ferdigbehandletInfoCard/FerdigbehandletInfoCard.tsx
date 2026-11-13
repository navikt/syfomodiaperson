import { BodyShort, InfoCard, Label } from "@navikt/ds-react";
import { InformationSquareIcon } from "@navikt/aksel-icons";
import { formatDateWithYear } from "@/utils/datoUtils.ts";
import {
  FerdigbehandletAndVurdertKandidat,
  FerdigbehandletKandidat,
  isFerdigbehandletAndVurdert,
} from "@/data/kartleggingssporsmal/kartleggingssporsmalTypes.ts";
import { useVeilederInfoQuery } from "@/data/veilederinfo/veilederinfoQueryHooks.ts";
import { VurderingAlternativ } from "@/sider/kartleggingssporsmal/types.ts";
import {
  IKKE_RISIKO_FOR_LANGTIDSFRAVAR,
  RISIKO_FOR_LANGTIDSFRAVAR,
} from "@/sider/kartleggingssporsmal/vurdering/KartleggingVurdering.tsx";

const texts = {
  svarVurdert: "Svarene ble vurdert",
  svarVurdertAv: "Oppgaven er behandlet av",
  vurderingLabel: "Vurdering",
  vurderingBeskrivelseLabel: "Beskrivelse",
};

interface Props {
  kandidat: FerdigbehandletKandidat | FerdigbehandletAndVurdertKandidat;
}

export function FerdigbehandletInfoCard({ kandidat }: Props) {
  const { data: veilederinfo } = useVeilederInfoQuery(
    kandidat.vurdering.vurdertBy,
  );

  const getVurderingText = (vurderingAlternativ: VurderingAlternativ) => {
    switch (vurderingAlternativ) {
      case "IKKE_RISIKO_FOR_LANGTIDSFRAVAR":
        return IKKE_RISIKO_FOR_LANGTIDSFRAVAR;
      case "RISIKO_FOR_LANGTIDSFRAVAR":
        return RISIKO_FOR_LANGTIDSFRAVAR;
    }
  };

  return (
    <InfoCard data-color="info" size="small">
      <InfoCard.Header icon={<InformationSquareIcon aria-hidden />}>
        <InfoCard.Title>
          {`${texts.svarVurdert} ${formatDateWithYear(
            kandidat.vurdering.vurdertAt,
          )}`}
        </InfoCard.Title>
      </InfoCard.Header>
      <InfoCard.Content className={"flex flex-col gap-2"}>
        <BodyShort size={"small"}>
          {`${texts.svarVurdertAv} ${veilederinfo?.fulltNavn() ?? kandidat.vurdering.vurdertBy}`}
        </BodyShort>

        {isFerdigbehandletAndVurdert(kandidat) && (
          <>
            <div>
              <Label size="small" as="span">
                {texts.vurderingLabel}
              </Label>
              <BodyShort size={"small"}>
                {getVurderingText(kandidat.vurdering.vurderingAlternativ)}
              </BodyShort>
            </div>

            {kandidat.vurdering.vurderingFritekst && (
              <div>
                <Label size="small" as="span">
                  {texts.vurderingBeskrivelseLabel}
                </Label>
                <BodyShort size={"small"}>
                  {kandidat.vurdering.vurderingFritekst}
                </BodyShort>
              </div>
            )}
          </>
        )}
      </InfoCard.Content>
    </InfoCard>
  );
}
