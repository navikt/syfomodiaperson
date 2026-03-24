import { Request } from "express";

import Config from "./config";

interface TokenIntrospectionResponse {
  active: boolean;
  NAVident?: string;
}

interface TokenExchangeResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

function extractBearerToken(req: Request): string | undefined {
  return req.headers.authorization?.replace("Bearer ", "");
}

/** Validates the bearer token on the request using Texas introspection. */
export async function validateToken(req: Request): Promise<boolean> {
  const token = extractBearerToken(req);
  if (!token) return false;

  const response = await fetch(Config.auth.texas.introspectionEndpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ identity_provider: "entra_id", token }),
  });

  if (!response.ok) {
    console.error(`Token introspection failed: ${response.status}`);
    return false;
  }

  const data = (await response.json()) as TokenIntrospectionResponse;
  return data.active;
}

/** Exchanges the user's bearer token for an OBO token via Texas token exchange. */
export async function getOnBehalfOfToken(
  req: Request,
  clientId: string
): Promise<string | undefined> {
  const userToken = extractBearerToken(req);
  if (!userToken) return undefined;

  const response = await fetch(Config.auth.texas.tokenExchangeEndpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      identity_provider: "entra_id",
      target: `api://${clientId}/.default`,
      user_token: userToken,
    }),
  });

  if (!response.ok) {
    console.error(`Token exchange failed: ${response.status}`);
    return undefined;
  }

  const data = (await response.json()) as TokenExchangeResponse;
  return data.access_token;
}

/** Extracts the NAVident claim from the bearer token via Texas introspection. */
export async function getVeilederidentFromRequest(
  req: Request
): Promise<string | undefined> {
  const token = extractBearerToken(req);
  if (!token) return undefined;

  const response = await fetch(Config.auth.texas.introspectionEndpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ identity_provider: "entra_id", token }),
  });

  if (!response.ok) {
    console.error(`Token introspection failed: ${response.status}`);
    return undefined;
  }

  const data = (await response.json()) as TokenIntrospectionResponse;
  if (!data.active) return undefined;

  return data.NAVident;
}
