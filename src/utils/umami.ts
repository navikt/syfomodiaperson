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

// Holds the resolve function of identifierReady so setIdentifier() can release the gate.
let resolveIdentifierReady: (() => void) | null = null;

// A pending promise used as a gate. trackEvent() awaits this before sending events,
// ensuring no events are tracked before the veileder identifier has been set.
// Resolved by setIdentifier() once umami.identify() completes.
const identifierReady = new Promise<void>((resolve) => {
  resolveIdentifierReady = resolve;
});

export async function setIdentifier(veilederident: string) {
  const maskedVeilederIdent = await hashId(veilederident);
  await umami.identify(maskedVeilederIdent);
  resolveIdentifierReady?.();
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

export async function trackEvent<K extends EventName>(
  event: TaxonomyEvent<K>,
): Promise<void> {
  await identifierReady;
  umami.track(event.name, { ...event.properties });
}
