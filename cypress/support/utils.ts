const MILLISECONDS_PER_HOUR = 3600000;
const DAY_IN_MILLISECONDS = MILLISECONDS_PER_HOUR * 24;

const TOMORROW = new Date(Date.now() + DAY_IN_MILLISECONDS);

export const tommorrowDateAsString = (): string => {
  const day =
    TOMORROW.getUTCDate() < 10
      ? `0${TOMORROW.getUTCDate()}`
      : TOMORROW.getUTCDate();
  const month =
    TOMORROW.getUTCMonth() + 1 < 10
      ? `0${TOMORROW.getUTCMonth() + 1}`
      : TOMORROW.getUTCMonth() + 1;
  return `${day}.${month}.${TOMORROW.getUTCFullYear()}`;
};
