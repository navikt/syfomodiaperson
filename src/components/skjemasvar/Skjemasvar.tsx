import { TextSvar } from "@/components/skjemasvar/TextSvar";
import { CheckboxSvar } from "@/components/skjemasvar/CheckboxSvar";
import { RadioGroupSvar } from "@/components/skjemasvar/RadioGroupSvar";
import React from "react";
import {
  FormSnapshot,
  FormSnapshotFieldType,
  RadioGroupFieldSnapshot,
  SingleCheckboxFieldSnapshot,
  TextFieldSnapshot,
} from "@/data/skjemasvar/types/SkjemasvarTypes";

interface Props {
  formSnapshot: FormSnapshot | null;
}

export const Skjemasvar = ({ formSnapshot }: Props) =>
  formSnapshot?.fieldSnapshots.map((field, index) => {
    switch (field.fieldType) {
      case FormSnapshotFieldType.TEXT:
        return <TextSvar key={index} textSvar={field as TextFieldSnapshot} />;
      case FormSnapshotFieldType.CHECKBOX_SINGLE:
        return (
          <CheckboxSvar
            key={index}
            checkboxSvar={field as SingleCheckboxFieldSnapshot}
          />
        );
      case FormSnapshotFieldType.RADIO_GROUP:
        return (
          <RadioGroupSvar
            key={index}
            radioGroupSvar={field as RadioGroupFieldSnapshot}
          />
        );
    }
  });
