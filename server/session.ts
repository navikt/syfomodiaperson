import express = require("express");
import connectRedis = require("connect-redis");
import session = require("express-session");
import redis = require("redis");

import Config = require("./config");

const SESSION_MAX_AGE_MILLIS = 12 * 60 * 60 * 1000;

const SESSION_MAX_AGE_SECONDS = SESSION_MAX_AGE_MILLIS / 1000;

const getRedisClient = () => {
  const redisClient = redis.createClient({
    url: Config.redis.uri,
    no_ready_check: true,
  });
  redisClient.auth(Config.redis.password, Config.redis.username);
  redisClient.select(Config.redis.database);
  return redisClient;
};

const getRedisStore = () => {
  if (Config.isDev) return undefined;
  const RedisStore = connectRedis(session);
  return new RedisStore({
    client: getRedisClient(),
    ttl: SESSION_MAX_AGE_SECONDS,
    disableTouch: true,
  });
};

export const setupSession = (app: express.Application) => {
  app.set("trust proxy", 1);

  app.use(
    session({
      cookie: {
        maxAge: SESSION_MAX_AGE_MILLIS,
        sameSite: "lax",
        httpOnly: true,
        secure: Config.isProd,
      },
      secret: Config.server.sessionKey,
      name: Config.server.sessionCookieName,
      resave: true,
      saveUninitialized: false,
      unset: "destroy",
      store: getRedisStore(),
      rolling: true,
    })
  );
};

module.exports = {
  setupSession: setupSession,
};
