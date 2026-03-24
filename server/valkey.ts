import { createClient, RedisClientType } from "redis";
import Config from "./config.js";

let valkeyClient: RedisClientType | undefined;

export async function getValkeyClient(): Promise<RedisClientType> {
  if (valkeyClient) {
    return valkeyClient;
  }

  valkeyClient = createClient({
    url: Config.valkey.uri,
    username: Config.valkey.username,
    password: Config.valkey.password,
    database: Config.valkey.database,
  }) as RedisClientType;

  await valkeyClient.connect();
  return valkeyClient;
}
