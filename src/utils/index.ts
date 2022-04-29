import { ReactNode } from "react";

interface VisProps {
  hvis?: boolean;
  children?: ReactNode;
  render?: any;
}

export const Vis = (visProps: VisProps) => {
  const { hvis, children, render } = visProps;
  return hvis && render ? render() : hvis && children ? children : null;
};

export const formaterOrgnr = (orgnr: string) => {
  return orgnr ? orgnr.replace(/(...)(...)(...)/g, "$1 $2 $3") : null;
};

export const tilStorForbokstav = (streng: string) => {
  return streng.replace(/^\w/, (c) => {
    return c.toUpperCase();
  });
};
