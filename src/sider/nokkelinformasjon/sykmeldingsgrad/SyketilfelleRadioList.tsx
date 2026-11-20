import { useOppfolgingstilfellePersonQuery } from "@/data/oppfolgingstilfelle/person/oppfolgingstilfellePersonQueryHooks";
import {
  ARBEIDSGIVERPERIODE_DAYS,
  OppfolgingstilfelleDTO,
} from "@/data/oppfolgingstilfelle/person/types/OppfolgingstilfellePersonDTO";
import { formatNumericDateRange } from "@/utils/datoUtils";
import {
  BodyShort,
  Button,
  Checkbox,
  Radio,
  RadioGroup,
  Tooltip,
} from "@navikt/ds-react";
import { useGetSykmeldingerQuery } from "@/data/sykmelding/useGetSykmeldingerQuery";
import { MedisinskrinImage } from "../../../../img/ImageComponents";
import { getDiagnoseFromTilfelle } from "@/utils/diagnoseUtils.ts";
import { useState } from "react";

const TILFELLER_TO_SHOW_DEFAULT = 10;

const texts = {
  title: "Siste sykefravær",
  visAlle: "Vis alle",
  visFarre: "Vis færre",
  showOnlyLongerThanArbeidsgiverperiode:
    "Vis bare sykefraværstilfeller med varighet utover arbeidsgiverperioden",
  noLongerThanArbeidsgiverperiode:
    "Ingen sykefraværstilfeller varer utover arbeidsgiverperioden.",
};

interface Props {
  selectedTilfelle?: OppfolgingstilfelleDTO;
  setSelectedTilfelle: (value: OppfolgingstilfelleDTO) => void;
}

export default function SyketilfelleRadioList({
  selectedTilfelle,
  setSelectedTilfelle,
}: Props) {
  const { tilfellerDescendingStart } = useOppfolgingstilfellePersonQuery();
  const { sykmeldinger } = useGetSykmeldingerQuery();
  const [showAllTilfeller, setShowAllTilfeller] = useState(false);
  const [
    showOnlyLongerThanArbeidsgiverperiode,
    setShowOnlyLongerThanArbeidsgiverperiode,
  ] = useState(false);

  const filteredTilfeller = showOnlyLongerThanArbeidsgiverperiode
    ? tilfellerDescendingStart.filter(
        (tilfelle) => tilfelle.antallSykedager > ARBEIDSGIVERPERIODE_DAYS,
      )
    : tilfellerDescendingStart;
  const tilfellerToShow = showAllTilfeller
    ? filteredTilfeller
    : filteredTilfeller.slice(0, TILFELLER_TO_SHOW_DEFAULT);

  function tilfelleText(tilfelle: OppfolgingstilfelleDTO) {
    return `${formatNumericDateRange(tilfelle.start, tilfelle.end)}`;
  }

  function handleFilterChange(filterIsChecked: boolean) {
    setShowOnlyLongerThanArbeidsgiverperiode(filterIsChecked);

    const currentTilfelle = selectedTilfelle ?? tilfellerDescendingStart[0];
    if (
      filterIsChecked &&
      currentTilfelle &&
      currentTilfelle.antallSykedager <= ARBEIDSGIVERPERIODE_DAYS
    ) {
      const firstMatchingTilfelle = tilfellerDescendingStart.find(
        (tilfelle) => tilfelle.antallSykedager > ARBEIDSGIVERPERIODE_DAYS,
      );
      if (firstMatchingTilfelle) {
        setSelectedTilfelle(firstMatchingTilfelle);
      }
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <Checkbox
        className="max-w-sm"
        size="small"
        checked={showOnlyLongerThanArbeidsgiverperiode}
        onChange={(event) => handleFilterChange(event.target.checked)}
      >
        {texts.showOnlyLongerThanArbeidsgiverperiode}
      </Checkbox>

      <RadioGroup
        legend={texts.title}
        onChange={setSelectedTilfelle}
        size="small"
        value={selectedTilfelle ?? tilfellerDescendingStart[0]}
      >
        {showOnlyLongerThanArbeidsgiverperiode &&
        filteredTilfeller.length === 0 ? (
          <BodyShort size="small">
            {texts.noLongerThanArbeidsgiverperiode}
          </BodyShort>
        ) : (
          tilfellerToShow.map((tilfelle: OppfolgingstilfelleDTO) => {
            const diagnose = getDiagnoseFromTilfelle(tilfelle, sykmeldinger);
            return (
              <div
                className="flex items-center gap-2 w-full justify-between whitespace-nowrap"
                key={`${tilfelle.start}-${tilfelle.end}`}
              >
                <div className="flex gap-2 items-center">
                  <Radio value={tilfelle}>{tilfelleText(tilfelle)}</Radio>
                  <BodyShort size="small">{`(${tilfelle.varighetUker} uker)`}</BodyShort>
                </div>
                {diagnose?.diagnosekode && (
                  <Tooltip content={diagnose.diagnose ?? "Ukjent diagnosenavn"}>
                    <div className="flex">
                      <img src={MedisinskrinImage} alt="Medisinskrin" />
                      <span className="ml-1">{diagnose.diagnosekode}</span>
                    </div>
                  </Tooltip>
                )}
              </div>
            );
          })
        )}
      </RadioGroup>

      {filteredTilfeller.length > TILFELLER_TO_SHOW_DEFAULT && (
        <Button
          className="w-fit"
          variant="tertiary"
          size="small"
          type="button"
          aria-expanded={showAllTilfeller}
          onClick={() => setShowAllTilfeller(!showAllTilfeller)}
        >
          {showAllTilfeller ? texts.visFarre : texts.visAlle}
        </Button>
      )}
    </div>
  );
}
