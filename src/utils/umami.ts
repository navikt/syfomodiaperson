export function setIdentifier(veilederident: string) {
  window.umami?.identify({ veilederident });
}
