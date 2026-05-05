import { createClient, RedisClientType } from "redis";
import Config from "./config.js";
import { logger } from "@navikt/pino-logger";

let valkeyClient: RedisClientType | undefined;

const MAX_RECONNECT_DELAY_MS = 5000;

export async function getValkeyClient(): Promise<RedisClientType> {
  if (valkeyClient?.isReady) {
    return valkeyClient;
  }

  if (valkeyClient) {
    valkeyClient.removeAllListeners();
    valkeyClient = undefined;
  }

  const client = createClient({
    url: Config.valkey.uri,
    username: Config.valkey.username,
    password: Config.valkey.password,
    database: Config.valkey.database,
    socket: {
      reconnectStrategy: (retries: number) => {
        const delay = Math.min(retries * 100, MAX_RECONNECT_DELAY_MS);
        logger.warn(`Valkey reconnect attempt ${retries}, next in ${delay}ms`);
        return delay;
      },
    },
  }) as RedisClientType;

  client.on("error", (err) => {
    logger.error({ err }, "Valkey client error");
  });

  client.on("end", () => {
    logger.warn("Valkey client disconnected");
    valkeyClient = undefined;
  });

  await client.connect();
  valkeyClient = client;
  return valkeyClient;
}
