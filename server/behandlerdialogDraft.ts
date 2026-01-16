import express = require("express");
import OpenIdClient = require("openid-client");

import { getValkeyClient } from "./valkey";
import { getOpenIdIssuer, getVeilederIdentFromRequest } from "./authUtils";

const DRAFT_TTL_SECONDS = 7 * 60 * 60 * 24;
const DRAFT_KEY_PREFIX = "draft:behandlerdialog:meldingtilbehandler";

interface BehandlerDraftDTO {
  type: string;
  behandlerRef: string;
  fnr?: string;
  fornavn: string;
  mellomnavn?: string;
  etternavn: string;
  kontor?: string;
  orgnummer?: string;
  telefon?: string;
}

interface MeldingTilBehandlerDraftDTO {
  tekst: string;
  meldingsType?: string;
  behandler?: BehandlerDraftDTO;
}

let _azureAdIssuer: OpenIdClient.Issuer<any> | undefined;

async function getIssuer(): Promise<OpenIdClient.Issuer<any>> {
  if (_azureAdIssuer) {
    return _azureAdIssuer;
  }
  _azureAdIssuer = await getOpenIdIssuer();
  return _azureAdIssuer;
}

function getPersonident(req: express.Request): string | undefined {
  const header = req.headers["nav-personident"];
  if (typeof header === "string" && header.trim() !== "") {
    return header;
  }
  return undefined;
}

async function draftKey(req: express.Request): Promise<string | undefined> {
  const personident = getPersonident(req);
  if (!personident) {
    return undefined;
  }

  const issuer = await getIssuer();
  const veilederIdent = await getVeilederIdentFromRequest(req, issuer);
  if (!veilederIdent) {
    return undefined;
  }

  return `${DRAFT_KEY_PREFIX}:${personident}:${veilederIdent}`;
}

/**
 * Sets up endpoints for drafting "melding til behandler" text.
 */
export function setupBehandlerdialogDraft(server: express.Application) {
  server.get(
    "/api/behandlerdialog/meldingtilbehandler/draft",
    async (req: express.Request, res: express.Response) => {
      const key = await draftKey(req);
      if (!key) {
        return res
          .status(400)
          .send({ message: "Missing nav-personident or valid bearer token" });
      }

      const client = getValkeyClient();
      client.get(key, (error, value) => {
        client.quit();
        if (error) {
          console.error("Failed to fetch draft from valkey", error);
          return res.status(500).send({ message: "Failed to fetch draft" });
        }
        if (!value) {
          return res.status(204).send();
        }
        try {
          const parsed = JSON.parse(value) as MeldingTilBehandlerDraftDTO;
          return res.status(200).send(parsed);
        } catch (e) {
          console.error("Failed to parse draft from valkey", e);
          return res.status(500).send({ message: "Failed to parse draft" });
        }
      });
    }
  );

  server.put(
    "/api/behandlerdialog/meldingtilbehandler/draft",
    async (req: express.Request, res: express.Response) => {
      const key = await draftKey(req);
      if (!key) {
        return res
          .status(400)
          .send({ message: "Missing nav-personident or valid bearer token" });
      }

      const body = req.body as Partial<MeldingTilBehandlerDraftDTO>;
      const tekst = typeof body.tekst === "string" ? body.tekst : "";

      const client = getValkeyClient();

      if (tekst.trim() === "") {
        client.del(key, (delError) => {
          client.quit();
          if (delError) {
            console.error("Failed to delete draft from valkey", delError);
            return res.status(500).send({ message: "Failed to delete draft" });
          }
          return res.status(204).send();
        });
        return;
      }

      const payload: MeldingTilBehandlerDraftDTO = {
        tekst,
        meldingsType: body.meldingsType,
        behandler: toBehandlerDraftDTO(body.behandler),
      };

      client.setex(
        key,
        DRAFT_TTL_SECONDS,
        JSON.stringify(payload),
        (setError) => {
          client.quit();
          if (setError) {
            console.error("Failed to save draft to valkey", setError);
            return res.status(500).send({ message: "Failed to save draft" });
          }
          return res.status(204).send();
        }
      );
    }
  );

  server.delete(
    "/api/behandlerdialog/meldingtilbehandler/draft",
    async (req: express.Request, res: express.Response) => {
      const key = await draftKey(req);
      if (!key) {
        return res
          .status(400)
          .send({ message: "Missing nav-personident or valid bearer token" });
      }

      const client = getValkeyClient();
      client.del(key, (error) => {
        client.quit();
        if (error) {
          console.error("Failed to delete draft from valkey", error);
          return res.status(500).send({ message: "Failed to delete draft" });
        }
        return res.status(204).send();
      });
    }
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function toBehandlerDraftDTO(value: unknown): BehandlerDraftDTO | undefined {
  if (!isRecord(value)) {
    return undefined;
  }

  const type = value.type;
  const behandlerRef = value.behandlerRef;
  const fornavn = value.fornavn;
  const etternavn = value.etternavn;

  if (
    typeof type !== "string" ||
    typeof behandlerRef !== "string" ||
    typeof fornavn !== "string" ||
    typeof etternavn !== "string"
  ) {
    return undefined;
  }

  const mellomnavn =
    typeof value.mellomnavn === "string" ? value.mellomnavn : undefined;
  const fnr = typeof value.fnr === "string" ? value.fnr : undefined;
  const kontor = typeof value.kontor === "string" ? value.kontor : undefined;
  const orgnummer =
    typeof value.orgnummer === "string" ? value.orgnummer : undefined;
  const telefon = typeof value.telefon === "string" ? value.telefon : undefined;

  return {
    type,
    behandlerRef,
    fnr,
    fornavn,
    mellomnavn,
    etternavn,
    kontor,
    orgnummer,
    telefon,
  };
}
