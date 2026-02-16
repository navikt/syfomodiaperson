import express = require("express");

import { getValkeyClient } from "./valkey";
import { getVeilederidentFromRequest } from "./authUtils";

const DRAFT_TTL_SECONDS = 7 * 60 * 60 * 24;

const VALID_CATEGORIES = [
  "behandlerdialog-meldingtilbehandler",
  "arbeidsuforhet-forhandsvarsel",
] as const;

type DraftCategory = (typeof VALID_CATEGORIES)[number];

const CATEGORY_KEY_PREFIX: Record<DraftCategory, string> = {
  "behandlerdialog-meldingtilbehandler": "draft:behandlerdialog:meldingtilbehandler",
  "arbeidsuforhet-forhandsvarsel": "draft:arbeidsuforhet:forhandsvarsel",
};

function isValidCategory(category: string): category is DraftCategory {
  return VALID_CATEGORIES.includes(category as DraftCategory);
}

function getPersonident(req: express.Request): string | undefined {
  const header = req.headers["nav-personident"];
  if (typeof header === "string" && header.trim() !== "") {
    return header;
  }
  return undefined;
}

async function draftKey(
  req: express.Request,
  category: DraftCategory
): Promise<string | undefined> {
  const personident = getPersonident(req);
  if (!personident) {
    return undefined;
  }

  const veilederIdent = await getVeilederidentFromRequest(req);
  if (!veilederIdent) {
    return undefined;
  }

  return `${CATEGORY_KEY_PREFIX[category]}:${veilederIdent}:${personident}`;
}

export function setupDraftEndpoints(server: express.Application) {
  server.get(
    "/api/draft/:category",
    async (req: express.Request, res: express.Response) => {
      const { category } = req.params;
      if (!isValidCategory(category)) {
        return res.status(400).send({ message: "Invalid draft category" });
      }

      const key = await draftKey(req, category);
      if (!key) {
        return res
          .status(400)
          .send({ message: "Missing nav-personident or valid bearer token" });
      }

      const client = getValkeyClient();
      client.get(key, (error, value) => {
        if (error) {
          console.error(
            `Failed to fetch draft for ${category} from valkey`,
            error
          );
          return res.status(500).send({ message: "Failed to fetch draft" });
        }
        if (!value) {
          return res.status(204).send();
        }
        try {
          const parsed = JSON.parse(value);
          return res.status(200).send(parsed);
        } catch (e) {
          console.error(`Failed to parse draft for ${category} from valkey`, e);
          return res.status(500).send({ message: "Failed to parse draft" });
        }
      });
    }
  );

  server.put(
    "/api/draft/:category",
    async (req: express.Request, res: express.Response) => {
      const { category } = req.params;
      if (!isValidCategory(category)) {
        return res.status(400).send({ message: "Invalid draft category" });
      }

      const key = await draftKey(req, category);
      if (!key) {
        return res
          .status(400)
          .send({ message: "Missing nav-personident or valid bearer token" });
      }

      const client = getValkeyClient();
      client.setex(
        key,
        DRAFT_TTL_SECONDS,
        JSON.stringify(req.body),
        (setError) => {
          if (setError) {
            console.error(
              `Failed to save draft for ${category} to valkey`,
              setError
            );
            return res.status(500).send({ message: "Failed to save draft" });
          }
          return res.status(204).send();
        }
      );
    }
  );

  server.delete(
    "/api/draft/:category",
    async (req: express.Request, res: express.Response) => {
      const { category } = req.params;
      if (!isValidCategory(category)) {
        return res.status(400).send({ message: "Invalid draft category" });
      }

      const key = await draftKey(req, category);
      if (!key) {
        return res
          .status(400)
          .send({ message: "Missing nav-personident or valid bearer token" });
      }

      const client = getValkeyClient();
      client.del(key, (error) => {
        if (error) {
          console.error(
            `Failed to delete draft for ${category} from valkey`,
            error
          );
          return res.status(500).send({ message: "Failed to delete draft" });
        }
        return res.status(204).send();
      });
    }
  );
}
