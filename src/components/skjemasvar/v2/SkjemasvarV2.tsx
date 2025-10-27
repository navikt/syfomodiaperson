import React from "react";
import {
  FormSnapshot,
  FormSnapshotFieldType,
  RadioGroupFieldSnapshot,
} from "@/data/skjemasvar/types/SkjemasvarTypes";
import { RadioGroupSvarV2 } from "@/components/skjemasvar/v2/RadioGroupSvarV2";

interface Props {
  formSnapshot: FormSnapshot | null;
}

export const SkjemasvarV2 = ({ formSnapshot }: Props) =>
  formSnapshot?.fieldSnapshots.map((field, index) => {
    switch (field.fieldType) {
      case FormSnapshotFieldType.RADIO_GROUP:
        return (
          <RadioGroupSvarV2
            key={index}
            radioGroupSvar={field as RadioGroupFieldSnapshot}
          />
        );
    }
  });
