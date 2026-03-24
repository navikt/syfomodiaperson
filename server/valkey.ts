import redis from "redis";

import Config from "./config";

let valkeyClient: redis.RedisClient | undefined;

export function getValkeyClient(): redis.RedisClient {
  if (valkeyClient) {
    return valkeyClient;
  }

  valkeyClient = redis.createClient({
    url: Config.valkey.uri,
    no_ready_check: true,
  });
  valkeyClient.auth(Config.valkey.password, Config.valkey.username);
  valkeyClient.select(Config.valkey.database);
  return valkeyClient;
}
