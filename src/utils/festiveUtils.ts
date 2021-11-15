import {
  KvinneImage,
  MannImage,
  PepperkakeKvinneImage,
  PepperkakeMannImage,
} from "../../img/ImageComponents";
import Snowflakes from "magic-snowflakes";

enum Month {
  DECEMBER = 11,
}

export const isDecember = () => {
  const currentMonth = new Date().getMonth();

  return currentMonth === Month.DECEMBER;
};

export const getKvinneImage = () => {
  if (isDecember()) {
    return PepperkakeKvinneImage;
  }
  return KvinneImage;
};

export const getMannImage = () => {
  if (isDecember()) {
    return PepperkakeMannImage;
  }
  return MannImage;
};

const snowflakes = new Snowflakes({
  count: 30,
  speed: 2,
});
snowflakes.stop();

export const startSnow = () => {
  if (isDecember()) {
    snowflakes.show();
    snowflakes.start();
  }
};

export const stopAndHideSnow = () => {
  snowflakes.hide();
  snowflakes.stop();
};
