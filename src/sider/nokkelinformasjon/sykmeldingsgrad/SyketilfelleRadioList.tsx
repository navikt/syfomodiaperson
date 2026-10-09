import { useOppfolgingstilfellePersonQuery } from "@/data/oppfolgingstilfelle/person/oppfolgingstilfellePersonQueryHooks";
import { OppfolgingstilfelleDTO } from "@/data/oppfolgingstilfelle/person/types/OppfolgingstilfellePersonDTO";
import { tilLesbarPeriodeMedArUtenManednavn } from "@/utils/datoUtils";
import { BodyShort, Radio, RadioGroup, Tooltip } from "@navikt/ds-react";
import { useGetSykmeldingerQuery } from "@/data/sykmelding/useGetSykmeldingerQuery";
import { MedisinskrinImage } from "../../../../img/ImageComponents";
import { getDiagnoseFromTilfelle } from "@/utils/diagnoseUtils.ts";

const texts = {
  title: "Siste sykefravær",
};

interface Props {
  setSelectedTilfelle: (value: OppfolgingstilfelleDTO) => void;
}

export default function SyketilfelleRadioList({ setSelectedTilfelle }: Props) {
  const { tilfellerDescendingStart } = useOppfolgingstilfellePersonQuery();
  const { sykmeldinger } = useGetSykmeldingerQuery();

  const tenLatestTilfeller = tilfellerDescendingStart?.slice(0, 10);

  function tilfelleText(tilfelle: OppfolgingstilfelleDTO) {
    return `${tilLesbarPeriodeMedArUtenManednavn(
      tilfelle.start,
      tilfelle.end,
    )}`;
  }

  return (
    <RadioGroup
      legend={texts.title}
      onChange={(value: OppfolgingstilfelleDTO) => setSelectedTilfelle(value)}
      size="small"
      defaultValue={tilfellerDescendingStart[0]}
    >
      {tenLatestTilfeller.map(
        (tilfelle: OppfolgingstilfelleDTO, index: number) => {
          const diagnose = getDiagnoseFromTilfelle(tilfelle, sykmeldinger);
          return (
            <div
              className="flex items-center gap-2 w-full justify-between"
              key={index}
            >
              <div className="flex gap-2 items-center">
                <Radio key={index} value={tilfelle}>
                  {tilfelleText(tilfelle)}
                </Radio>
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
        },
      )}
    </RadioGroup>
  );
}
