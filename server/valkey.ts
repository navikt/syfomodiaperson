import { createClient, RedisClientType } from "redis";
import Config from "./config.js";
import { logger } from "@navikt/pino-logger";

let valkeyClient: RedisClientType | undefined;

const MAX_RECONNECT_DELAY_MS = 5000;

/**
 * Initializes and connects the Valkey client. Call once at server startup.
 */
export async function connectValkey(): Promise<void> {
  valkeyClient = createClient({
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

  valkeyClient.on("error", (err) => {
    logger.error({ err }, "Valkey client error");
  });

  await valkeyClient.connect();
  logger.info("Valkey client connected");
}

/**
 * Returns the Valkey client. Throws if {@link connectValkey} has not been called.
 */
export function getValkeyClient(): RedisClientType {
  if (!valkeyClient) {
    throw new Error(
      "Valkey client is not initialized. Call connectValkey() at startup."
    );
  }
  return valkeyClient;
}
