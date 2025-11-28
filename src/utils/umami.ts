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
