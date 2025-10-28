import React from "react";
import { KartleggingssporsmalRadioGroupSvar } from "@/sider/kartleggingssporsmal/skjemasvar/KartleggingssporsmalRadioGroupSvar";
import {
  KartleggingssporsmalFormSnapshot,
  KartleggingssporsmalFormSnapshotFieldType,
  KartleggingssporsmalRadioGroupFieldSnapshot,
} from "@/data/kartleggingssporsmal/kartleggingssporsmalSkjemasvarTypes";

interface Props {
  formSnapshot: KartleggingssporsmalFormSnapshot | null;
}

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
    }
  });
