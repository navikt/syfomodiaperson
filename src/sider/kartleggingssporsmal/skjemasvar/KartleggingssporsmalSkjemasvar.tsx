import React from "react";
import { KartleggingssporsmalRadioGroupSvar } from "@/sider/kartleggingssporsmal/skjemasvar/KartleggingssporsmalRadioGroupSvar";
import {
  KartleggingssporsmalFormSnapshot,
  KartleggingssporsmalFormSnapshotFieldType,
  KartleggingssporsmalRadioGroupFieldSnapshot,
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
export const KartleggingssporsmalSkjemasvar = ({ formSnapshot }: Props) =>
  formSnapshot?.fieldSnapshots.map((field, index) => {
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
      default:
        return (
          <Alert className="w-1/2" variant={"warning"}>
            Mottok spørsmål av typen: {field.fieldType} som fremvisningen ikke
            støtter.
          </Alert>
        );
    }
  });
