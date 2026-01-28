import express = require("express");

import { getValkeyClient } from "./valkey";
import { getVeilederidentFromRequest } from "./authUtils";

const DRAFT_TTL_SECONDS = 7 * 60 * 60 * 24;
const DRAFT_KEY_PREFIX = "draft:behandlerdialog:meldingtilbehandler";

interface MeldingTilBehandlerDraftDTO {
  tekst: string;
  meldingType?: string;
  behandlerRef?: string;
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

  const veilederIdent = await getVeilederidentFromRequest(req);
  if (!veilederIdent) {
    return undefined;
  }

  return `${DRAFT_KEY_PREFIX}:${veilederIdent}:${personident}`;
}

export function setupBehandlerdialogDraftEndpoints(
  server: express.Application
) {
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
      const payload: MeldingTilBehandlerDraftDTO = {
        tekst,
        meldingType: body.meldingType,
        behandlerRef: body.behandlerRef,
      };

      const client = getValkeyClient();

      client.setex(
        key,
        DRAFT_TTL_SECONDS,
        JSON.stringify(payload),
        (setError) => {
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
        if (error) {
          console.error("Failed to delete draft from valkey", error);
          return res.status(500).send({ message: "Failed to delete draft" });
        }
        return res.status(204).send();
      });
    }
  );
}
