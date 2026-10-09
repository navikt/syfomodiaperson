import {
  Alert,
  BodyShort,
  Box,
  Button,
  Heading,
  Tooltip,
} from "@navikt/ds-react";
import { MedisinskrinImage } from "../../../img/ImageComponents.ts";
import { OppfolgingstilfelleDTO } from "@/data/oppfolgingstilfelle/person/types/OppfolgingstilfellePersonDTO.ts";
import { tilLesbarPeriodeMedArUtenManednavn } from "@/utils/datoUtils.ts";
import { getDiagnoseFromTilfelle } from "@/utils/diagnoseUtils.ts";
import { Fragment, useState } from "react";
import { useOppfolgingstilfellePersonQuery } from "@/data/oppfolgingstilfelle/person/oppfolgingstilfellePersonQueryHooks.ts";
import { useGetSykmeldingerQuery } from "@/data/sykmelding/useGetSykmeldingerQuery.ts";

const TILFELLER_TO_SHOW_DEFAULT = 5;

const texts = {
  header: "Sykefraværhistorikk",
  tooltipFallback: "Ukjent diagnosenavn",
  imageAlt: "Medisinskrin",
  weeks: "uker",
  error: "En feil oppstod ved henting av data.",
};

export function SyketilfelleList() {
  const [showAllTilfeller, setShowAllTilfeller] = useState(false);

  const {
    tilfellerDescendingStart,
    isLoading: isTilfellerLoading,
    isError: isTilfellerError,
  } = useOppfolgingstilfellePersonQuery();
  const oppfolgingstilfeller = tilfellerDescendingStart || [];
  const {
    sykmeldinger,
    isLoading: isSykmeldingerLoading,
    isError: isSykmeldingerError,
  } = useGetSykmeldingerQuery();

  const isPending = isTilfellerLoading || isSykmeldingerLoading;
  const isError = isTilfellerError || isSykmeldingerError;

  const tilfellerToShow = showAllTilfeller
    ? oppfolgingstilfeller
    : oppfolgingstilfeller.slice(0, TILFELLER_TO_SHOW_DEFAULT);

  if (isPending) {
    return null;
  }

  if (isError) {
    return (
      <Box
        padding="space-16"
        background="default"
        className="mb-2 h-min flex flex-col gap-6"
      >
        <Heading level="2" size="medium">
          {texts.header}
        </Heading>
        <Alert variant={"error"}>{texts.error}</Alert>
      </Box>
    );
  }

  return (
    <Box
      padding="space-16"
      background="default"
      className="mb-2 h-min flex flex-col gap-6"
    >
      <Heading level="2" size="medium">
        {texts.header}
      </Heading>

      <div className={"grid grid-cols-[max-content_min-content] gap-4"}>
        {tilfellerToShow.map(
          (tilfelle: OppfolgingstilfelleDTO, index: number) => {
            const diagnose = getDiagnoseFromTilfelle(tilfelle, sykmeldinger);
            return (
              <Fragment key={index}>
                <div className="flex gap-2 items-center w-full ">
                  {`${tilLesbarPeriodeMedArUtenManednavn(
                    tilfelle.start,
                    tilfelle.end,
                  )}`}
                  <BodyShort size="small">{`(${tilfelle.varighetUker} ${texts.weeks})`}</BodyShort>
                </div>

                {diagnose?.diagnosekode ? (
                  <Tooltip content={diagnose.diagnose ?? texts.tooltipFallback}>
                    <div className="flex">
                      <img src={MedisinskrinImage} alt={texts.imageAlt} />
                      <span className="ml-1">{diagnose.diagnosekode}</span>
                    </div>
                  </Tooltip>
                ) : (
                  <div />
                )}
              </Fragment>
            );
          },
        )}
      </div>

      {oppfolgingstilfeller.length > TILFELLER_TO_SHOW_DEFAULT && (
        <Button
          className={"w-fit"}
          variant={"tertiary"}
          size={"small"}
          onClick={() => setShowAllTilfeller(!showAllTilfeller)}
        >
          {showAllTilfeller ? "Vis færre" : "Vis alle"}
        </Button>
      )}
    </Box>
  );
}
