import {
  FormSnapshot,
  FormSnapshotFieldType,
  RadioGroupFieldSnapshot,
  SingleCheckboxFieldSnapshot,
  TextFieldSnapshot,
} from "@/data/motebehov/types/motebehovTypes";
import { TextSvar } from "@/sider/dialogmoter/motebehov/skjema/TextSvar";
import { CheckboxSvar } from "@/sider/dialogmoter/motebehov/skjema/CheckboxSvar";
import { RadioGroupSvar } from "@/sider/dialogmoter/motebehov/skjema/RadioGroupSvar";
import React from "react";

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
