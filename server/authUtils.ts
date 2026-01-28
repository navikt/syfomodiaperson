import { Request } from "express";
import OpenIdClient = require("openid-client");
import {
  createRemoteJWKSet,
  FlattenedJWSInput,
  JWSHeaderParameters,
  jwtVerify,
} from "jose";
import { GetKeyFunction, JWTPayload } from "jose/dist/types/types";

import Config = require("./config");

type OboToken = {
  accessToken: string;
  expiresIn: number;
};

type CachedOboToken = {
  token: OboToken;
  expires: number;
};

declare module "express-session" {
  export interface SessionData {
    tokenCache: { [clientId: string]: CachedOboToken };
  }
}

const OBO_TOKEN_EXPIRATION_MARGIN_SECONDS = 60;
const OPENID_ISSUER_CACHE_TTL_MS = 60 * 60 * 1000;

let _cachedIssuer:
  | { issuer: OpenIdClient.Issuer<any>; expiresAt: number }
  | undefined;

let _issuerInFlight: Promise<OpenIdClient.Issuer<any>> | undefined;

let _remoteJWKSet: GetKeyFunction<JWSHeaderParameters, FlattenedJWSInput>;

async function initJWKSet() {
  _remoteJWKSet = await createRemoteJWKSet(new URL(Config.auth.jwksUri));
}

async function retrieveAndValidateToken(
  req: Request
): Promise<string | undefined> {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (token && (await validateToken(token))) {
    return token;
  }
  return undefined;
}

async function validateToken(token: string): Promise<boolean> {
  const payload = await verifyTokenGetPayload(token);
  if (!payload) {
    return false;
  } else {
    return checkVerificationPayload(payload);
  }
}

async function verifyTokenGetPayload(
  token: string
): Promise<JWTPayload | undefined> {
  try {
    if (!_remoteJWKSet) {
      await initJWKSet();
    }
    const issuer = await getOpenIdIssuer();
    const verification = await jwtVerify(token, _remoteJWKSet, {
      audience: Config.auth.clientId,
      issuer: issuer.metadata.issuer,
    });
    return verification.payload;
  } catch (e) {
    console.error("Token validation failed:", e);
  }
}

function checkVerificationPayload(payload: JWTPayload): boolean {
  if (
    payload &&
    payload.aud == Config.auth.clientId &&
    payload.exp &&
    payload.exp * 1000 > Date.now()
  ) {
    return true;
  } else {
    console.error(
      "Token audience or expiry check failed: aud " +
        payload.aud +
        " exp " +
        payload.exp
    );
  }
  return false;
}

function isNotExpired(token: CachedOboToken): boolean {
  return (
    token.expires >= Date.now() + OBO_TOKEN_EXPIRATION_MARGIN_SECONDS * 1000
  );
}

export async function getOrRefreshOnBehalfOfToken(
  authClient: OpenIdClient.Client,
  req: Request,
  clientId: string
): Promise<OboToken | undefined> {
  const token = await retrieveAndValidateToken(req);
  if (!token) {
    throw Error(
      "Could not get on-behalf-of token because the token was undefined"
    );
  }
  if (req.session.tokenCache === undefined) {
    req.session.tokenCache = {};
  }

  let cachedOboToken = req.session.tokenCache[clientId];
  if (cachedOboToken && isNotExpired(cachedOboToken)) {
    return cachedOboToken.token;
  } else {
    const onBehalfOfToken = await requestOnBehalfOfToken(
      authClient,
      token,
      clientId
    );
    if (!onBehalfOfToken) {
      return undefined;
    }
    cachedOboToken = {
      token: onBehalfOfToken,
      expires: Date.now() + onBehalfOfToken.expiresIn * 1000,
    };
    req.session.tokenCache[clientId] = cachedOboToken;
  }
  return cachedOboToken.token;
}

async function requestOnBehalfOfToken(
  authClient: OpenIdClient.Client,
  accessToken: string,
  clientId: string
): Promise<OboToken | undefined> {
  const grantBody = {
    assertion: accessToken,
    client_assertion_type:
      "urn:ietf:params:oauth:client-assertion-type:jwt-bearer",
    grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
    requested_token_use: "on_behalf_of",
    scope: `api://${clientId}/.default`,
  };
  const tokenSet = await authClient.grant(grantBody);
  if (!tokenSet) {
    return undefined;
  } else {
    return {
      accessToken: tokenSet.access_token,
      expiresIn: tokenSet.expires_in,
    } as OboToken;
  }
}

export async function getOpenIdIssuer(): Promise<OpenIdClient.Issuer<any>> {
  if (_cachedIssuer && _cachedIssuer.expiresAt > Date.now()) {
    return _cachedIssuer.issuer;
  }

  if (_issuerInFlight) {
    return _issuerInFlight;
  }

  _issuerInFlight = (async () => {
    try {
      const issuer = await OpenIdClient.Issuer.discover(
        Config.auth.discoverUrl
      );

      _cachedIssuer = {
        issuer,
        expiresAt: Date.now() + OPENID_ISSUER_CACHE_TTL_MS,
      };

      return issuer;
    } finally {
      _issuerInFlight = undefined;
    }
  })();

  return _issuerInFlight;
}

export async function getOpenIdClient(
  issuer: OpenIdClient.Issuer<any>
): Promise<OpenIdClient.Client> {
  return new issuer.Client(
    {
      client_id: Config.auth.clientId,
      redirect_uris: [Config.auth.redirectUri],
      token_endpoint_auth_method: "private_key_jwt",
      token_endpoint_auth_signing_alg: "RS256",
    },
    Config.auth.jwks
  );
}

export async function getVeilederidentFromRequest(
  req: Request
): Promise<string | undefined> {
  const token = await retrieveAndValidateToken(req);
  if (!token) {
    return undefined;
  }
  const payload = await verifyTokenGetPayload(token);
  return (payload as Record<string, unknown>)?.["NAVident"] as string;
}
