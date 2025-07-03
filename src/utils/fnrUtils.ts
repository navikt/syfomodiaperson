export const formaterFnr = (fnr: string) => {
  return fnr ? fnr.replace(/(......)(.....)/g, "$1 $2") : null;
};
