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

const isApril = (date: Date) => {
  return date.getMonth() === 3;
};

const isEasterDate = (date: Date) => {
  if (date.getDate() === 6) {
    return isAfternoon(date);
  }
  return date.getDate() >= 7 && date.getDate() <= 18;
};

const isAfternoon = (date: Date) => {
  return date.getHours() >= 12;
};

export const isEaster = () => {
  const today = new Date(Date.now());
  return isApril(today) && isEasterDate(today);
};
