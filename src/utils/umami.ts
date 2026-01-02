/**
 See documentation for naming guidelines: https://startumami.ansatt.nav.no/taksonomi
 Other documentation for umami on Aksel: https://aksel.nav.no/god-praksis/artikler/male-brukeradferd-med-umami
 */
export enum EventType {
  LenkeKlikket = "lenke klikket",
}

/** Event fired when a link is clicked
 * @property tekst - The text of the link
 * @property destinasjonUrl - The destination URL of the link
 */
export type LenkeKlikket = {
  type: EventType.LenkeKlikket;
  data: {
    tekst: string;
    destinasjonUrl: string;
  };
};

type Event = LenkeKlikket;

export async function setIdentifier(veilederident: string) {
  const maskedVeilederIdent = await hashId(veilederident);
  await umami.identify(maskedVeilederIdent);
}

async function hashId(id: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(id);

  const hash = await crypto.subtle.digest("SHA-256", data);
  return [...new Uint8Array(hash)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
    .slice(0, 40);
}

function beforeSendHandler(type, payload) {
  if (payload.id != null) {
    return payload;
  }
  return null;
}

// Make the function globally accessible to make "data-before-send" in umami script work
(window as any).beforeSendHandler = beforeSendHandler;

export function trackEvent(event: Event) {
  umami.track(event.type, { ...event.data });
}
