import React from "react";
import { KartleggingssporsmalRadioGroupSvar } from "@/sider/kartleggingssporsmal/skjemasvar/KartleggingssporsmalRadioGroupSvar";
import { KartleggingssporsmalTextSvar } from "@/sider/kartleggingssporsmal/skjemasvar/KartleggingssporsmalTextSvar";
import {
  KartleggingssporsmalFormSnapshot,
  KartleggingssporsmalFormSnapshotFieldType,
  KartleggingssporsmalRadioGroupFieldSnapshot,
  KartleggingssporsmalTextFieldSnapshot,
} from "@/data/kartleggingssporsmal/kartleggingssporsmalSkjemasvarTypes";
import { Alert } from "@navikt/ds-react";

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
        switch (field.fieldType) {
          case KartleggingssporsmalFormSnapshotFieldType.RADIO_GROUP:
            return (
              <KartleggingssporsmalRadioGroupSvar
                key={index}
                radioGroupSvar={
                  field as KartleggingssporsmalRadioGroupFieldSnapshot
                }
              />
            );
          case KartleggingssporsmalFormSnapshotFieldType.TEXT:
            return (
              <KartleggingssporsmalTextSvar
                key={index}
                textSvar={field as KartleggingssporsmalTextFieldSnapshot}
              />
            );
          default:
            return (
              <Alert className="w-1/2" variant={"error"}>
                Mottok spørsmål av typen: {field.fieldType} som fremvisningen
                ikke støtter. Send en sak i Porten der du melder ifra om dette.
              </Alert>
            );
        }
      })}
    </div>
  );
}
