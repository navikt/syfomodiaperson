import { ReactElement } from "react";
import {
  MeldingDTO,
  MeldingType,
} from "@/data/behandlerdialog/behandlerdialogTypes";
import { Box, Detail, ErrorMessage } from "@navikt/ds-react";
import {
  ExclamationmarkTriangleIcon,
  PaperclipIcon,
} from "@navikt/aksel-icons";
import { tilDatoMedManedNavnOgKlokkeslett } from "@/utils/datoUtils";
import { VisMelding } from "@/sider/behandlerdialog/meldinger/samtale/VisMelding";
import PdfVedleggLink from "@/sider/behandlerdialog/meldinger/PdfVedleggLink";
import { DocumentComponentType } from "@/data/documentcomponent/documentComponentTypes";
import { PaminnelseWarningIcon } from "@/sider/behandlerdialog/meldinger/paminnelse/PaminnelseWarningIcon";
import { getHeaderText } from "@/utils/documentComponentUtils";
import { useVeilederInfoQuery } from "@/data/veilederinfo/veilederinfoQueryHooks";
import { meldingTypeTexts } from "@/data/behandlerdialog/behandlerdialogTexts";
import { ReturLegeerklaringWarningIcon } from "@/sider/behandlerdialog/legeerklaring/ReturLegeerklaringWarningIcon";

const texts = {
  ikkeLevertError: "Denne meldingen ble ikke levert.",
};

interface MeldingTekstProps {
  melding: MeldingDTO;
}

const MeldingTekst = ({ melding }: MeldingTekstProps): ReactElement => {
  const { tekst, type, innkommende, document } = melding;
  const isPaminnelseTilBehandler =
    type === MeldingType.FORESPORSEL_PASIENT_PAMINNELSE && !innkommende;
  const isReturLegeerklaring =
    type === MeldingType.HENVENDELSE_RETUR_LEGEERKLARING;

  if (isPaminnelseTilBehandler) {
    const headerText = getHeaderText(document, DocumentComponentType.HEADER_H1);
    return (
      <>
        <div className={"whitespace-pre-wrap wrap-anywhere"}>{headerText}</div>
        <PaminnelseWarningIcon />
      </>
    );
  } else {
    return (
      <>
        <div className={"whitespace-pre-wrap wrap-anywhere"}>{tekst}</div>
        {isReturLegeerklaring && <ReturLegeerklaringWarningIcon />}
      </>
    );
  }
};

interface Props {
  melding: MeldingDTO;
  avvist?: boolean;
}

export default function MeldingInnholdPanel({ melding, avvist }: Props) {
  const { data: veilederInfo } = useVeilederInfoQuery(
    melding.veilederIdent ?? "",
  );
  const avsender = melding.innkommende
    ? melding.behandlerNavn
    : veilederInfo?.fulltNavn() || "";

  return (
    <Box className={"p-4 border rounded-lg bg-surface-default"}>
      {avvist && (
        <div className={"flex flex-row items-center gap-2 mb-2"}>
          <ExclamationmarkTriangleIcon color="var(--ax-text-danger-decoration)" />
          <ErrorMessage size={"small"}>{texts.ikkeLevertError}</ErrorMessage>
        </div>
      )}
      <div className="flex justify-start flex-row flex-wrap gap-[0.2em] items-center mb-[0.75em]">
        <MeldingTekst melding={melding} />
      </div>
      {melding.innkommende && melding.antallVedlegg > 0 && (
        <div className="flex flex-row flex-wrap mb-[0.75em] gap-x-[0.25em]">
          <PaperclipIcon title="Binders-ikon for vedlegg" fontSize="1.25em" />
          {[...Array(melding.antallVedlegg)].map((_, index) => (
            <PdfVedleggLink
              melding={melding}
              vedleggNumber={index}
              key={index}
            />
          ))}
        </div>
      )}
      <div className="flex flex-row justify-start items-center gap-[1em]">
        <Detail className="self-center">
          {tilDatoMedManedNavnOgKlokkeslett(melding.tidspunkt)}
        </Detail>
        <Detail className="self-center">
          {meldingTypeTexts[melding.type]}
        </Detail>
        {avsender && <Detail>{`Skrevet av ${avsender}`}</Detail>}
        {!melding.innkommende && <VisMelding melding={melding} />}
      </div>
    </Box>
  );
}
