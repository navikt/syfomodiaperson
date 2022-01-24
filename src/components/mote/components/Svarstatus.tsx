import React from "react";
import {
  MoteAlternativDTO,
  MoteDTO,
  MotedeltakerType,
} from "@/data/mote/types/moteTypes";
import BesvarteTidspunkter from "./BesvarteTidspunkter";
import Utvidbar from "../../Utvidbar";
import {
  BlaaKalenderImage,
  SortKalenderImage,
} from "../../../../img/ImageComponents";

const texts = {
  flereTidpunkt: "+ Legg til tidspunkt",
  foreslattTidligere: "Tidspunkt foreslått tidligere",
};

export const erSamtidig = (createdA: Date, createdB: Date, offset = 1000) => {
  const a = createdA.getTime();
  const b = createdB.getTime();
  const startA = a - offset;
  const endA = a + offset;
  return startA < b && endA > b;
};

const sorterAlternativer = (alternativer: MoteAlternativDTO[]) => {
  return alternativer.sort((a, b) => {
    if (a.created.getTime() > b.created.getTime()) {
      return -1;
    } else if (b.created.getTime() > a.created.getTime()) {
      return 1;
    }
    return 0;
  });
};

export const getNyeAlternativer = (mote: MoteDTO) => {
  if (!mote.alternativer) {
    return [];
  }
  const alternativer = sorterAlternativer(mote.alternativer);
  const nyesteCreated = alternativer[0].created;
  return mote.alternativer
    .filter((a) => {
      return erSamtidig(a.created, nyesteCreated);
    })
    .sort((a, b) => {
      if (a.tid.getTime() > b.tid.getTime()) {
        return 1;
      } else if (b.tid.getTime() > a.tid.getTime()) {
        return -1;
      }
      return 0;
    });
};

export const getGamleAlternativer = (mote: MoteDTO) => {
  if (!mote.alternativer) {
    return [];
  }
  const alternativer = sorterAlternativer(mote.alternativer);
  const nyesteCreated = alternativer[0].created;
  return mote.alternativer
    .filter((a) => {
      return !erSamtidig(a.created, nyesteCreated);
    })
    .sort((a, b) => {
      if (a.tid.getTime() > b.tid.getTime()) {
        return 1;
      } else if (b.tid.getTime() > a.tid.getTime()) {
        return -1;
      }
      return 0;
    });
};

interface SvarstatusProps {
  mote: MoteDTO;
  visFlereAlternativ: any;
  children: any;
}

const Svarstatus = (svarstatusProps: SvarstatusProps) => {
  const { mote, visFlereAlternativ, children } = svarstatusProps;
  const nyeAlternativer = getNyeAlternativer(mote);
  const gamleAlternativer = getGamleAlternativer(mote);
  return (
    <div>
      <div className="svarstatus">
        <BesvarteTidspunkter
          mote={mote}
          alternativer={nyeAlternativer}
          deltakertype={MotedeltakerType.NAV_VEILEDER}
        />
        <button className="nyetidspunktknapp" onClick={visFlereAlternativ}>
          {texts.flereTidpunkt}
        </button>
        {children}
      </div>
      {gamleAlternativer.length > 0 && (
        <Utvidbar
          ikon={SortKalenderImage}
          ikonHover={BlaaKalenderImage}
          className="blokk"
          tittel={texts.foreslattTidligere}
        >
          <BesvarteTidspunkter
            mote={mote}
            alternativer={gamleAlternativer}
            deltakertype={MotedeltakerType.NAV_VEILEDER}
          />
        </Utvidbar>
      )}
    </div>
  );
};

export default Svarstatus;
