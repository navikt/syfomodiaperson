/**
 See documentation for naming guidelines: https://startumami.ansatt.nav.no/taksonomi
 Other documentation for umami on Aksel: https://aksel.nav.no/god-praksis/artikler/male-brukeradferd-med-umami
 */
export {
  Events,
  type TaxonomyEvent,
  type EventName,
} from "@navikt/analytics-types";

import type { EventName, TaxonomyEvent } from "@navikt/analytics-types";

/** Resolves once the veileder identifier has been set via {@link setIdentifier}. */
let identifierReady: Promise<void> = Promise.resolve();

/**
 * Hashes and sets the veileder identifier in Umami.
 * Must be called before any {@link trackEvent} calls to ensure events are attributed correctly.
 */
export function setIdentifier(veilederident: string): void {
  identifierReady = (async () => {
    const maskedVeilederIdent = await hashId(veilederident);
    await umami.identify(maskedVeilederIdent);
  })();
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

/**
 * Tracks a Umami event. Waits for the veileder identifier to be set before sending,
 * to ensure the event is correctly attributed.
 */
export async function trackEvent<K extends EventName>(
  event: TaxonomyEvent<K>
): Promise<void> {
  await identifierReady;
  umami.track(event.name, { ...event.properties });
}
