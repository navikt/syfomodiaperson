import {
  KvinneImage,
  MannImage,
  PepperkakeKvinneImage,
  PepperkakeMannImage,
} from "../../img/ImageComponents";

enum Month {
  DECEMBER = 11,
}

const currentMonth = new Date().getMonth();

export const getKvinneImage = () => {
  if (currentMonth === Month.DECEMBER) {
    return PepperkakeKvinneImage;
  }
  return KvinneImage;
};

export const getMannImage = () => {
  if (currentMonth === Month.DECEMBER) {
    return PepperkakeMannImage;
  }
  return MannImage;
};
