import { KartleggingssporsmalRadioGroupSvar } from "@/sider/kartleggingssporsmal/skjemasvar/KartleggingssporsmalRadioGroupSvar";
import { KartleggingssporsmalTextSvar } from "@/sider/kartleggingssporsmal/skjemasvar/KartleggingssporsmalTextSvar";
import {
  KartleggingssporsmalFormSnapshot,
  KartleggingssporsmalFormSnapshotFieldType,
} from "@/data/kartleggingssporsmal/kartleggingssporsmalSkjemasvarTypes";
import { LocalAlert } from "@navikt/ds-react";

const texts = {
  unsupportedFieldType: (fieldType: string) =>
    `Mottok spørsmål av typen: ${fieldType} som fremvisningen ikke støtter. Send en sak i Porten der du melder ifra om dette.`,
};

interface Props {
  formSnapshot: KartleggingssporsmalFormSnapshot | null;
}

/**
 * Benytter FormSnapshot 2.0 hvorav **RadioGroupFieldSnapshot** ikke lenger har
 * følgende felter:
 * - selectedOptionId
 * - selectedOptionLabel
 */
export function KartleggingssporsmalSkjemasvar({ formSnapshot }: Props) {
  return (
    <div className="flex flex-col gap-7">
      {formSnapshot?.fieldSnapshots.map((field, index) => {
        const fieldType: string = field.fieldType;

        switch (field.fieldType) {
          case KartleggingssporsmalFormSnapshotFieldType.RADIO_GROUP:
            return (
              <KartleggingssporsmalRadioGroupSvar
                key={index}
                radioGroupSvar={field}
              />
            );
          case KartleggingssporsmalFormSnapshotFieldType.TEXT:
            return (
              <KartleggingssporsmalTextSvar key={index} textSvar={field} />
            );
          default:
            return (
              <LocalAlert key={index} className="w-1/2" status="error">
                <LocalAlert.Header>
                  <LocalAlert.Title>
                    {texts.unsupportedFieldType(fieldType)}
                  </LocalAlert.Title>
                </LocalAlert.Header>
              </LocalAlert>
            );
        }
      })}
    </div>
  );
}
