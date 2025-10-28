import React from "react";
import { KartleggingssporsmalRadioGroupSvar } from "@/sider/kartleggingssporsmal/skjemasvar/KartleggingssporsmalRadioGroupSvar";
import { KartleggingssporsmalCheckboxSvar } from "@/sider/kartleggingssporsmal/skjemasvar/KartleggingssporsmalCheckboxSvar";
import { KartleggingssporsmalTextSvar } from "@/sider/kartleggingssporsmal/skjemasvar/KartleggingssporsmalTextSvar";
import {
  KartleggingssporsmalFormSnapshot,
  KartleggingssporsmalFormSnapshotFieldType,
  KartleggingssporsmalRadioGroupFieldSnapshot,
  KartleggingssporsmalSingleCheckboxFieldSnapshot,
  KartleggingssporsmalTextFieldSnapshot,
} from "@/data/kartleggingssporsmal/kartleggingssporsmalSkjemasvarTypes";

interface Props {
  formSnapshot: KartleggingssporsmalFormSnapshot | null;
}

export const KartleggingssporsmalSkjemasvar = ({ formSnapshot }: Props) =>
  formSnapshot?.fieldSnapshots.map((field, index) => {
    switch (field.fieldType) {
      case KartleggingssporsmalFormSnapshotFieldType.TEXT:
        return (
          <KartleggingssporsmalTextSvar
            key={index}
            textSvar={field as KartleggingssporsmalTextFieldSnapshot}
          />
        );
      case KartleggingssporsmalFormSnapshotFieldType.CHECKBOX_SINGLE:
        return (
          <KartleggingssporsmalCheckboxSvar
            key={index}
            checkboxSvar={
              field as KartleggingssporsmalSingleCheckboxFieldSnapshot
            }
          />
        );
      case KartleggingssporsmalFormSnapshotFieldType.RADIO_GROUP:
        return (
          <KartleggingssporsmalRadioGroupSvar
            key={index}
            radioGroupSvar={
              field as KartleggingssporsmalRadioGroupFieldSnapshot
            }
          />
        );
    }
  });
