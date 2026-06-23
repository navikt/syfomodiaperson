import type { Request } from "express";

import Config from "./config.js";
import { logger } from "@navikt/pino-logger";

interface TokenIntrospectionResponse {
  active: boolean;
  NAVident?: string;
  groups: string[];
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
    logger.error(`Token introspection failed: ${response.status}`);
    return false;
  }

  const data = (await response.json()) as TokenIntrospectionResponse;
  logger.info(`user groups: ${data.groups.join(", ")}`);
  return data.active;
}

function decodeJwtPayload(token: string): Record<string, unknown> {
  const payload = token.split(".")[1];
  return JSON.parse(Buffer.from(payload, "base64url").toString("utf-8"));
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
    logger.error(`Token exchange failed: ${response.status}`);
    return undefined;
  }

  const data = (await response.json()) as TokenExchangeResponse;
  const oboToken = data.access_token;
  const claims = decodeJwtPayload(oboToken);
  const groups = Array.isArray(claims.groups) ? claims.groups : [];
  logger.info(`OBO token groups: ${groups.join(", ")}`);
  return oboToken;
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
    logger.error(`Token introspection failed: ${response.status}`);
    return undefined;
  }

  const data = (await response.json()) as TokenIntrospectionResponse;
  if (!data.active) return undefined;

  return data.NAVident;
}
